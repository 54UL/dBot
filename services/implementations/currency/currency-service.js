
class CurrencyService {

    constructor() {
    }

    async init(dependency) {

        this.logger = dependency.get("Logger");
        this.logger.info("CurrencyService ready");
    }

    async dispose() {

    }

    async interval() {

    }
}

module.exports = { CurrencyService }