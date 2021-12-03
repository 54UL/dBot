const e = require("cors");
const { Wallet } = require("./models/wallet");

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

    async addBalance(userId, handBalance, bankBalance, creditBalance) {
        let wallet = this.getWallet(userId);
        wallet.handBalance += handBalance;
        wallet.bankBalance += bankBalance;
        wallet.creditBalance += creditBalance;
    }

    //Implementation
    async wipe(usersIds, amount) {
        usersIds.forEach(id => {
            this.bankAccounts.set(id, new Wallet(0,50000,0));
        });
        this.logger.warn("yoooo some one just wiped the economy");
    }

    getWallet(userId) {
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