// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');


class BotAppService {
    constructor() {
        // Create a new client instance
        this.buttonHandlers = new Map();
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    }

    async init(dependency) {
        //TODO:REFACTOR
        this.dependency = dependency; //thus to forward reference in execute inside of a command
        this.logger = dependency.get("Logger");
        this.discord = dependency.get("Discord");
        this.commandHandlers = this.discord.getCommands();
        // When the client is ready, run this code (only once)
        this.client.once('ready', () => {
            this.logger.info("discord client ready :3");
        });

        this.client.on('interactionCreate', async interaction => {
            this.logger.warn("command interaction id: " + interaction);
            if (interaction.isCommand()) {
                const { commandName } = interaction;
                this.logger.warn("command interaction name: " + commandName);
                try {
                    return await this.commandHandlers.get(commandName).execute(interaction, this.dependency);
                } catch (error) {
                    this.logger.fatal(`cannot execute command [${commandName}] due: ${error}`);
                    await interaction.reply({ content: 'server crashed', ephemeral: true });
                }
            } else if (interaction.isButton()) {
                const buttonId = interaction.customId;
                const suspectUserId = interaction.user.id;
                const owner = interaction.member.user.id;
                if (suspectUserId !== owner)
                    return await interaction.reply({ content: "don't press others buttons 😡", ephemeral: true });

                try {
                    this.logger.warn("button interaction id : " + buttonId);
                    await this.buttonHandlers.get(buttonId)(interaction, this.dependency);
                } catch (error) {
                    this.logger.fatal(`cannot handle button interaction [${buttonId}] due: ${error.stack}`);
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                // this.buttonHandlers.delete(buttonId);//Removes the handler
                //await interaction.update({ content: "pressed!!!" });
            }
            else {
                this.logger.fatal(`interaction not implemented`);
                await interaction.reply({ content: 'what?!!! yooo some one just broke the bot smh', ephemeral: false });
            }
        });

        // Login to Discord with your client's token
        this.client.login(process.env.BOT_TOKEN);
    }

    addButtonHandler(buttonId, handler) {
        this.buttonHandlers.set(buttonId, handler);
    }

    async dispose() {

    }

    async interval() {

    }
}

module.exports = { BotAppService }