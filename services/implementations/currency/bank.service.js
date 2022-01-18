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

        if (requestedWallet.handBalance < amount) return false;//nel
        
        requestedWallet.handBalance -= amount;
        beneficiaryWallet.handBalance += amount;
        return true;//to chido
    }

    async steal(userId, members) {
        const robberWallet = this.getWallet(userId);
        const stealProbability = Math.floor(Math.random() * 100);
        const members = client.guilds.cache.get(process.env.GUILD_ID).members.cache;

        if(stealProbability >= 30){
            //get some random user to fuck with
            const userTofuckWithIndex = Math.floor(Math.random() * members.guild.memberCount);
            members.cache[userTofuckWithIndex];
            const victimWallet = this.getWallet(userTofuckWithId);
            const balanceToStole = Math.floor(Math.random() * victimWallet.handBalance);
            await this.addBalance(userTofuckWithId,-balanceToStole,0,0);
        }else{
            // catch the robber
            const fineBalance = Math.floor(Math.random() * 5000);
            await this.addBalance(userId,-fineBalance,0,0);
        }
    }

    async deposit(amount, userId) {

    }

    async requestCredit(amount, userId) {

    }

}

module.exports = { BankService }