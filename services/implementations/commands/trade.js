const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('exchange xexos'),
    async execute(interaction,dependecy) {
        const bankService = dependecy.get("Bank");
        const userId = interaction.user.id;
        

        
    }
};
