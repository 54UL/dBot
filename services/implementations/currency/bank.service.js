const e = require("cors");

class BankService {


    constructor() {
        this.bankAccounts = new Map();

    }

    async init(dependency) {
        this.logger = dependency.get("Logger");
    }

    async dispose() {

    }

    async interval() {

    }

    async setBalance(userId, balance) {
        this.bankAccounts.set(userId, balance);
    }
    //Implementation
    async wipe(usersIds, amount) {
        usersIds.forEach(id => {
            this.setBalance(id, amount);
        });
        this.logger.warn("yoooo some one just wiped the economy");
    }

    async getBalance(userId) {
        return this.bankAccounts.get(userId);
    }

    async trade(amount, userFromId, userToId) {

    }

    async deposit(amount, userId) {

    }

    async requestCredit(amount, userId) {

    }



}

module.exports = { BankService }