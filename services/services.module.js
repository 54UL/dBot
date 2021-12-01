const { CommandDeployer } = require("./implementations/command-deployer");
const { DiscordService } = require("./implementations/discord.service");
const { BotAppService } = require("./implementations/bot-app.service");
const { CurrencyService } = require("./implementations/currency/currency-service");
const { BlackJackService } = require("./implementations/games/black-jack.service");

module.exports = [
    DiscordService,
    CommandDeployer,
    BotAppService,
    CurrencyService,
    BlackJackService
]


