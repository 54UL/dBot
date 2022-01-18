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
        const wipeValue = 50000;
        usersIds.forEach(id => {
            this.bankAccounts.set(id, new Wallet(0, wipeValue, 0));
        });
        this.logger.warn("all balances wiped to:");
    }

    getWallet(userId) {
        return this.bankAccounts.get(userId);
    }

    async trade(amount, from, to) {
        const requestedWallet = this.bankAccounts.get(from.userId);
        const beneficiaryWallet = this.bankAccounts.get(to.userId);

        if (requestedWallet.handBalance < amount) return;//nel
        
        requestedWallet.handBalance -= amount;
        beneficiaryWallet.handBalance += amount;
        return //to chido
    }

    async steal(userId) {
        const robber  = this.bankAccounts.get(userId);
        const stealProbability = Math.floor(Math.random() * 100) ;
        if(stealProbability >= 30){
            //get some random user to fuck with
        }else{
            // catch the robber
        }
    }

    async deposit(amount, userId) {

    }

    async requestCredit(amount, userId) {

    }

}

module.exports = { BankService }