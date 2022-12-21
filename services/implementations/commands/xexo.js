const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xexo')
        .setDescription('👁👁'),
    async execute(interaction,dependecy) {
        await interaction.reply("xexoooooooooooooooooooooooooooooooooooooooooooooooooo :xexo:");
    }
};
