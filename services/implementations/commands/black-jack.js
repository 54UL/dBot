const { SlashCommandBuilder } = require('@discordjs/builders');
const { blackJackEmbed, blackJackRow } = require('../discord-messages-templates/black-jack.embed');




module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('black jack game uwu')
        .addNumberOption(option => option.setName('amount').setDescription('how much u want to trade uwu')),
    async execute(interaction, dependecy) {
        const blackJackService = dependecy.get("BlackJack");
        const currentUserId = interaction.user.id;

        //TODO: REFACTOR
        blackJackService.startGame(currentUserId);
        const initialPlayersDeck = blackJackService.getPlayerDeck(currentUserId);
        const initialDealersDeck = blackJackService.getDealersDeck(currentUserId);
        const initialRemainingCards = blackJackService.getRemainingCards(currentUserId);
        const playerHandValue = blackJackService.getPlayerHandValue(currentUserId);
        const dealerHandValue = blackJackService.getDealerHandValue(currentUserId);

        //check if we have a black jack at the begining 
        const status = blackJackService.isBlackJack(currentUserId);
        const embed = blackJackEmbed(status, initialPlayersDeck, initialDealersDeck, initialRemainingCards, playerHandValue, dealerHandValue);
        if (status != 1) {
            await interaction.reply({ embeds: [embed], components: [blackJackRow] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    }
};
