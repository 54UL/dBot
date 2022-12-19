// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');


class BotAppService {
    constructor() {
        // Create a new client instance
        this.buttonHandlers = new Map();
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
    }

    async init(dependency) {
        //TODO:REFACTOR
        this.dependency = dependency; //thus to forward reference in execute inside of a command
        this.logger = dependency.get("Logger");
        this.discord = dependency.get("Discord");
        this.commandHandlers = this.discord.getCommands();
        // When the client is ready, run this code (only once)

        this.client.on('message', (message) => {
            onMessage(message);
        });

        this.client.once('ready', () => {
            this.onReady();
        });

        this.client.on('interactionCreate', async interaction => {
            return this.onInteractionCreate(interaction);
        });

        // Login to Discord with your client's token
        this.client.login(process.env.BOT_TOKEN);
    }

    onReady() {
        this.logger.info("discord client ready :3");
    }

    onMessage(message) 
    {
        this.logger.info(`bot recived message:` + message);

        if (!message.author.bot) message.author.send('ok:::::: ' + message.author.id);
    }

    async onInteractionCreate(interaction) {
        this.logger.warn("command interaction id: " + interaction);
        if (interaction.isCommand()) {
            return this.onCommandInteraction(interaction);
        } else if (interaction.isButton()) {
           return this.onButtonInteraction(interaction);
        }
        else {
            this.logger.fatal(`interaction not implemented`);
            await interaction.reply({ content: 'what?!!! yooo some one just broke the bot smh', ephemeral: false });
        }
    }

    addButtonHandler(buttonId, handler) {
        this.buttonHandlers.set(buttonId, handler);
    }

    async onCommandInteraction(interaction)
    {
        const { commandName } = interaction;
        this.logger.warn("command interaction name: " + commandName);

        try {
            return await this.commandHandlers.get(commandName).execute(interaction, this.dependency);
        } catch (error) 
        {
            this.logger.fatal(`cannot execute command [${commandName}] due: ${error}`);
            return await interaction.reply({ content: 'server crashed', ephemeral: true });
        }
    }

    async onButtonInteraction(interaction)
    {
        const buttonId = interaction.customId;
        const suspectUserId = interaction.user.id;
        const owner = interaction.member.user.id;


        if (suspectUserId !== owner)
            return await interaction.reply({ content: "don't press others buttons 😡", ephemeral: true });

        try 
        {
            this.logger.warn("button interaction id : " + buttonId);
            let handler = await this.buttonHandlers.get(buttonId);

            if (handler != null)
                return handler(interaction, this.dependency);
            else
                this.logger.error("button NOT FOUND (interaction id : " + buttonId);

        } catch (error) {
            this.logger.fatal(`cannot handle button interaction [${buttonId}] due: ${error.stack}`);
            return await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    getClient() {
        return this.client;
    }

    async dispose() {

    }

    async interval() {

    }
}

module.exports = { BotAppService }