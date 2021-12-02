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
            return "Grab a card or hit 😡";
        case 1:
            return "You won 😋";
        case 2:
            return "You lost 🥺";
        case 3:
            return "Draw 😳";
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
    blackJackEmbed: (embedForm) => {
        return new MessageEmbed()
            .setAuthor(embedForm.userName)
            .setColor(resolveColor(embedForm.status))
            .setTitle(`black jack | bet of: 666`)
            .setDescription(resolveDescription(embedForm.status))
            .addFields(
                { name: "Your hand:", value: embedForm.cards, inline: false },
                { name: `Value: ${embedForm.playerCardsValue}`, value: '\u200B', inline: false },
                // { name: endGame ? "Result:" : "\u200B", value: endGame ? "u lost ${amount}" : "\u200B" },
                // { name: '\u200B', value: '\u200B' },
                { name: "Dealer hand:", value: resolveDealerHand(embedForm.status, embedForm.dealerCards), inline: false },
                { name: resolveDealerValue(embedForm.status, embedForm.dealerCardsValue), value: '\u200B', inline: false },
                { name: `Remaining cards: ${embedForm.cardsRemaining} `, value: "\u200B", inline: true })
            .setTimestamp()
    },
    blackJackRow: new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('take-card')
                .setLabel('Grab')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('pass-card')
                .setLabel('Hit')
                .setStyle('DANGER'),
        )
}
