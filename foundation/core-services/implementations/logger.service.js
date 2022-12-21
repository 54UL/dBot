
const log4js = require("log4js");

class LoggerService {

    constructor() {
        log4js.configure({
            appenders: { out: { type: 'stdout' }, XEXO: { type: "file", filename: "app.log" } },
            categories: { default: { appenders: ["XEXO", "out"], level: "debug" } } // level: "error"
        });
        this.logger = log4js.getLogger("XEXO");
    }

    async init(dependency) {
    }

    async dispose() {

    }

    async interval() {

    }

    //Implementation
    async info(message) {
       
        this.logger.info(message.toUpperCase());
    }

    async warn(message) {
        this.logger.warn(message.toUpperCase());
    }

    async error(message) {
        this.logger.error(message.toUpperCase());
    }

    async fatal(message) {
        this.logger.fatal(message.toUpperCase());
    }
}

module.exports = { LoggerService }