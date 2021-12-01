const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('losers')
        .setDescription('worst of the worst '),
    async execute(interaction,dependecy) {
        
    }
};
