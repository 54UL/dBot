const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credit')
        .setDescription('yo need money cos broke? i got u dont worry... ☠️☠️☠️'),
    async execute(interaction,dependecy) {
    }
};
