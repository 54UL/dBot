const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scream')
        .setDescription('👁👁'),
    async execute(interaction,dependecy) {
        await interaction.reply("sexoooooooooooooooooooooooooooooooooooooooooooooooooo :xexo:");
    }
};
