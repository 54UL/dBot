
const suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
const numbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const { blackJackEmbed, blackJackRow } = require('../discord-messages-templates/black-jack.embed');

class Card {
    constructor(suit, number) {
        this.suit = suits[suit];
        this.number = numbers[number];
        this.value = this.getPoint(number);
    }

    getSymbol() {
        return this.suit + this.number
    }

    getPoint(number) {
        let value = 0;
        if (number === 0) {
            value = 11;
        } else if (number >= 10) {
            value = 10;
        } else {
            value = number + 1;
        }
        return value;
    }
}

class DeckOfCards {
    constructor() {
        this.allCards = [];

        for (let suit = 0; suit < 4; suit++) {
            for (let number = 0; number < 13; number++) {
                let card = new Card(suit, number);
                this.allCards.push(card);
            }
        }

        let temp = [];
        while (this.allCards.length > 0) {
            let randomNum = Math.floor(Math.random() * this.allCards.length);
            temp.push(this.allCards[randomNum]);
            this.allCards.splice(randomNum, 1);
        }
        this.allCards = temp;
    }

    getACard() {
        return this.allCards.shift();
    }
}

class Person {
    constructor() {
        this.cards = [];
        this.values = 0;
        this.numOfCards = 0;
        this.aces = 0;
        this.faces = 0;
        this.bj = false;
    }

    addACard(card) {
        this.cards.push(card);
        this.numOfCards += 1;
        this.values += this.addPoint(card);
        this.aces += this.haveAce(card.number);
        this.faces += this.haveFace(card.value);
        this.bj = this.isBJ();
    }

    getCards() {
        return this.cards.map(card => card.getSymbol()).join(' - ');
    }

    handValue() {
        return this.values;
    }

    addPoint(card) {
        if (card.number === "A" && this.aces > 1) {
            return 1;
        } else {
            return card.value;
        }
    }

    haveAce(number) {
        if (number === "A") {
            return 1;
        }
        return 0;
    }

    haveFace(value) {
        if (value === 10) {
            return 1;
        }
        return 0;
    }

    isBJ() {
        if (this.values === 21)
            return this.aces === 1 && this.faces === 1;
        else
            return false;
    }
}

class BlackJackMatch {
    constructor() {
        this.player = new Person();
        this.dealer = new Person();
        this.players = []; //for the future
        this.deck = new DeckOfCards();
    }
}

class BlackJackService {
    constructor() {
        this.matches = new Map();
    }

    async init(dependency) {
        this.logger = dependency.get("Logger");
        this.botApp = dependency.get("BotApp");

        this.botApp.addButtonHandler('take-card', this.nextTurn.bind(this));
        this.botApp.addButtonHandler('pass-card', this.passTurn.bind(this));

        this.logger.info("Black jack service ready");
    }

    startGame(userId) {
        var createdMatch = new BlackJackMatch(userId);
        //Initial game scramble
        createdMatch.player.addACard(createdMatch.deck.getACard());
        createdMatch.dealer.addACard(createdMatch.deck.getACard());
        createdMatch.player.addACard(createdMatch.deck.getACard());
        createdMatch.dealer.addACard(createdMatch.deck.getACard());

        this.matches.set(userId, createdMatch);
    }

    async nextTurn(interaction) {
        this.logger.warn("Next card !!!" + interaction);
        const userId = interaction.user.id;
        const userMatch = this.matches.get(userId);
        //TODO: REFACTOR, put this inside of a function called players turn
        userMatch.player.addACard(userMatch.deck.getACard());
        const gameOver = this.isOver21(userId);
        const blackJackStatus = this.isBlackJack(userId);
        let status = 0;

        if (gameOver)
            status = 2;

        if (blackJackStatus == 1)
            status = 1;

        await interaction.message.edit({ components: [] });
        const embed = blackJackEmbed(status, userMatch.player.getCards(), userMatch.dealer.getCards(), userMatch.deck.allCards.length.toString(), userMatch.player.values.toString(), userMatch.dealer.values.toString());
        if (!gameOver && !isWinner) {
            await interaction.reply({ embeds: [embed], components: [blackJackRow] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    }

    async passTurn(interaction) {
        //Fetch user id and proced to the corresponding match
        //Only dealers turn???
        //TODO: REFACTOR, put this inside of a function called players turn
        this.dealersTurn(interaction);
    }

    dealersTurn(interaction) {
        const userId = interaction.user.id;
        const userMatch = this.matches.get(userId);
        this.logger.warn("revealing..." + interaction);

        while (userMatch.dealer.values < 17) {
            userMatch.dealer.addACard(userMatch.deck.getACard());
        }

        //SOFT case
        if (userMatch.dealer.values > 21) {
            if (userMatch.dealer.aces !== 0) {
                userMatch.dealer.values -= 10;
                userMatch.dealer.aces -= 1;
                dealersTurn();
            } else {
                // gameOver = true;
            }
        }
    }

    //returns 0 if no one has bj, 1 if player has bj, 2 if player and dealer has bj
    isBlackJack(userId) {
        const userMatch = this.matches.get(userId);
        this.logger.info(userMatch.player);
        if (userMatch.player.bj) {
            if (userMatch.dealer.bj)
                return 2;
            else
                return 1;
        }
        else {
            return 0;
        }
    }

    isOver21(userId) {
        let player = this.matches.get(userId).player;
        if (player.values > 21) {
            if (player.aces !== 0) {
                player.values -= 10;
                player.aces -= 1;
                return false;//soft
            }
            else {
                return true;
            }
        }
    }

    getPlayerDeck(userId) {
        return this.matches.get(userId).player.getCards();
    }

    getDealersDeck(userId) {
        return this.matches.get(userId).dealer.getCards();
    }

    getPlayerHandValue(userId) {
        return this.matches.get(userId).player.handValue().toString();
    }

    getDealerHandValue(userId) {
        return this.matches.get(userId).dealer.handValue().toString();
    }

    getRemainingCards(userId) {
        return this.matches.get(userId).deck.allCards.length.toString();
    }

    async dispose() {

    }

    async interval() {

    }
}

module.exports = { BlackJackService }