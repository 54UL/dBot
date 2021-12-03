const { CommandDeployer } = require("./implementations/command-deployer");
const { DiscordService } = require("./implementations/discord.service");
const { BotAppService } = require("./implementations/bot-app.service");
const { BankService } = require("./implementations/currency/bank.service");
const { BlackJackService } = require("./implementations/games/black-jack.service");

module.exports = [
    DiscordService,
    CommandDeployer,
    BotAppService,
    BankService,
    BlackJackService
]


