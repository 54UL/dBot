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
        default:
            return "#d53b3e";
    }
}

const resolveDescription = (status) => {
    switch (status) {
        case 0:
            return "Take a card or go to hell 😡";
        case 1:
            return "You won 😋";
        case 2:
            return "You lost 🥺";
        default:
            return "NONE";
    }
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
                // // { name: '\u200B', value: '\u200B' },
                { name: "Dealer hand:", value: dealerCards, inline: false },
                { name: `Value: ${dealerCardsValue}`, value: '\u200B', inline: false },
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
