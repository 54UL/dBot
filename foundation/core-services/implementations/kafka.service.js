const { Kafka, logLevel } = require('kafkajs');

class KafkaService {
    constructor() {
        this.handlers = new Map();
        this.responseHandlers = new Map();
        this.kafkaCtx = null;
        this.generalProducer = null;
        this.responseProducer = null;
        this.generalConsumer = null;
        this.responseConsumer = null;
    }

    async init(dependency) {
        this.logger = dependency.get("Logger");
        await this.initKafka();
        await this.initGeneralConsumer();
        await this.initResponseConsumer();
        this.logger.warn(`Kafka service running | group-id: ${process.env.KAFKA_GROUP_ID} | listening topic:${process.env.KAFKA_TOPIC}`);
    }


    async dispose() {
        this.generalProducer.disconnect();
        this.responseProducer.disconnect();
        this.generalConsumer.disconnect();
        this.responseConsumer.disconnect();
        this.logger.info("kafka connection closed....")
    }

    async interval() {

    }

    //Implementation 
    async initKafka() {
        const config = JSON.parse(process.env.KAFKA_BROKERS.trim());

        const KafkaLogger = logLevel => ({ namespace, level, label, log }) => {
            const { timestamp, logger, message, ...others } = log
            const logInfo = `[${namespace}] ${message} ${JSON.stringify(others)}`;
            switch (label) {
                case 'ERROR':
                    return this.logger.fatal(logInfo);
                case 'DEBUG':
                case 'INFO':
                    return this.logger.info(logInfo);
                case 'WARN':
                    return this.logger.warn(logInfo);
            }
        }

        this.kafkaCtx = new Kafka({
            clientId: `${process.env.KAFKA_GROUP_ID}`,
            brokers: config.brokers,
            logCreator: KafkaLogger
        });

        this.generalProducer = this.kafkaCtx.producer();
        this.responseProducer = this.kafkaCtx.producer();


        await this.generalProducer.connect();
        await this.responseProducer.connect();
    }

    async initGeneralConsumer() {
        this.generalConsumer = this.kafkaCtx.consumer({ groupId: `${process.env.KAFKA_GROUP_ID}` });
        await this.generalConsumer.connect();
        await this.generalConsumer.subscribe({ topic: `${process.env.KAFKA_TOPIC}`, fromBeginning: true });
        await this.generalConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                await this.dispatchMessage(topic, message);
            }
        });
    }

    async initResponseConsumer() {
        this.responseConsumer = this.kafkaCtx.consumer({ groupId: `${process.env.KAFKA_RESPONSE_GROUP_ID}` });
        await this.responseConsumer.connect();
        await this.responseConsumer.subscribe({ topic: process.env.KAFKA_TOPIC + process.env.KAFKA_RESPONSE_PREFIX, fromBeginning: true });
        await this.responseConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.dispatchResponse(message);
            }
        });
    }

    async dispatchResponse(message) {
        try {
            const cmd = message.key.toString();
            const fetchedHandler = this.responseHandlers.get(cmd);
            if (!fetchedHandler) {
                return this.logger.error(`kafka response consumer cannot find handler named:${cmd}`);
            }
            fetchedHandler.handler(JSON.parse(message.value.toString()));
        } catch (error) {
            this.logger.error("Incorrect format to dispatch response message:" + error.message);
        }
    }

    async dispatchMessage(topic, payload) {
        try {
            const cmd = payload.key.toString();
            const fetchedHandler = this.handlers.get(cmd);
            if (!fetchedHandler) {
                return this.logger.error(`kafka consumer cannot find handler named:${cmd}`);
            }
            //Response producer (only if exists response topic)
            const parsedPayload = JSON.parse(payload.value.toString());
            const response = await fetchedHandler.handler(parsedPayload);
            if (parsedPayload.responseTopic) {
                await this.responseProducer.send({
                    topic: parsedPayload.responseTopic,
                    messages: [
                        { key: cmd, value: JSON.stringify(response) },
                    ],
                })
            }
        } catch (error) {
            this.logger.error("Incorrect format to dispatch message:" + error.message);
        }
    }

    messagePattern(topic, command, handler) {
        this.logger.warn("Listener added:" + command);
        this.handlers.set(command, { topic, handler });
    }

    addResponseHandler(command, handler) {
        this.responseHandlers.set(command, { handler });
    }

    removeResponseHandler(command) {
        this.responseHandlers.delete(command);
    }

    async send(topic, command, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                payload.responseTopic = process.env.KAFKA_TOPIC + process.env.KAFKA_RESPONSE_PREFIX;
                await this.generalProducer.send({
                    topic: topic,
                    messages: [
                        { key: command, value: JSON.stringify(payload) },
                    ],
                })

                let resolved = false;
                this.addResponseHandler(command, (response) => {
                    if (response) {
                        resolved = true;
                        this.removeResponseHandler(command);
                        resolve(response);
                    }
                });

                setTimeout(() => {
                    if (!resolved) {
                        this.removeResponseHandler(command);
                        reject(`Connection timeout:${topic}/${command}`);
                    }
                }, Number(process.env.KAFKA_RESPONSE_TIME_OUT_MS));

            } catch (error) {
                this.logger.error("kafkaService: error producing topic");
                reject(error);
            }
        });
    }
}

module.exports = { KafkaService };