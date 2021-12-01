const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('trade currency with ur friends n.n')
        .addUserOption(option => option.setName('to').setDescription('fren to trade :>'))
        .addNumberOption(option => option.setName('amount').setDescription('how much u want to trade uwu')),
    async execute(interaction,dependecy) {
        await interaction.reply('trade most new');
    }
};
