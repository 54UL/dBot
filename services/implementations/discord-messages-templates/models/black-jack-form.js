const { SlashCommandBuilder } = require('@discordjs/builders');


class BlackJackForm {
    constructor(status, userName, cards, dealerCards, remainingCards, playerCardsValue, dealerCardsValue) {
        this.status = status;
        this.userName = userName;
        this.cards = cards;
        this.dealerCards = dealerCards;
        this.cardsRemaining = remainingCards;
        this.playerCardsValue = playerCardsValue;
        this.dealerCardsValue = dealerCardsValue;
    }
}


module.exports = { BlackJackForm }