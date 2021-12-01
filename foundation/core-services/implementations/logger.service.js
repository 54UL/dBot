
const log4js = require("log4js");

class LoggerService {

    constructor() {
        log4js.configure({
            appenders: { out: { type: 'stdout' }, cheese: { type: "file", filename: "app.log" } },
            categories: { default: { appenders: ["cheese", "out"], level: "debug" } } // level: "error"
        });
        this.logger = log4js.getLogger("cheese");
    }

    async init(dependency) {
    }

    async dispose() {

    }

    async interval() {

    }

    //Implementation
    async info(message) {
        this.logger.info(message);
    }

    async warn(message) {
        this.logger.warn(message);
    }

    async error(message) {
        this.logger.error(message);
    }

    async fatal(message) {
        this.logger.fatal(message);
    }
}

module.exports = { LoggerService }