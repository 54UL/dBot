const { SlashCommandBuilder } = require('@discordjs/builders');
const { replyEmbed, replyEmbedComponents: components } = require('../discord-messages-templates/reply.embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('request validation'),
    async execute(interaction, dependecy) 
    {
        // const bankService = dependecy.get("Bank");
        // const userName = interaction.user.username;
        const userId = interaction.user.id;
        // const wallet = bankService.getWallet(userId);

        const embed = replyEmbed({});
        await interaction.reply({ embeds: [embed], components: [components] });
    }
};
