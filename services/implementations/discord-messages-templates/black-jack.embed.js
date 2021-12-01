const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');


const resolveColor = (status) => {
    switch (status) {
        case 0:
            return "#5865f2"; //standard color
        case 1:
            return "#3ba55c";// won
        case 2:
            return "#d53b3e";// lost
        case 3:
            return "#000000";// tie
        default:
            return "#d53b3e";
    }
}

const resolveDescription = (status) => {
    switch (status) {
        case 0:
            return "Grab a card or go to hell 😡";
        case 1:
            return "You won 😋";
        case 2:
            return "You lost 🥺";
        case 3:
            return "Tie 😳";
        default:
            return "NONE";
    }
}

const resolveDealerHand = (status, dealerCards) => {
    let text = "";
    if (status == 0)
        return `${text} ${dealerCards.slice(0, 2)} - XX`;
    else
        return `${text} ${dealerCards}`;
}

const resolveDealerValue = (status, dealerValue) => {
    let text = "Value: ";
    if (status == 0)
        return `${text} XX`;
    else
        return `${text} ${dealerValue}`;
}



module.exports = {
    blackJackEmbed: (status, cards, dealerCards, cardsRemaining, playerCardsValue, dealerCardsValue) => {
        return new MessageEmbed()
            .setColor(resolveColor(status))
            .setTitle("21 | ${username}")
            .setDescription(resolveDescription(status))
            .addFields(
                { name: "Your hand:", value: cards, inline: false },
                { name: `Value: ${playerCardsValue}`, value: '\u200B', inline: false },
                // { name: endGame ? "Result:" : "\u200B", value: endGame ? "u lost ${amount}" : "\u200B" },
                { name: '\u200B', value: '\u200B' },
                { name: "Dealer hand:", value: resolveDealerHand(status, dealerCards), inline: false },
                { name: resolveDealerValue(status, dealerCardsValue), value: '\u200B', inline: false },
                { name: "Cards remaining:", value: cardsRemaining, inline: true })
            .setTimestamp()
            .setFooter("--------------------------------------------------------|");
    },
    blackJackRow: new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('take-card')
                .setLabel('Take')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('pass-card')
                .setLabel('Pass')
                .setStyle('DANGER'),
        )
}
