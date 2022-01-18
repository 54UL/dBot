const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription('basically fuck you 🖕🖕🖕'),
    async execute(interaction,dependecy) {
        const bankService = dependecy.get("Bank");
        const userId = interaction.user.id;
        const memebers = interaction.guild.members;
        await bankService.steal(userId, memebers);
    }
};
