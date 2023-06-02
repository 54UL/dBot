# dBot =＾● ⋏ ●＾=
basic discord bot infrastructure implementing:
- Currency system (bot currency)
- Games
- And more...

# Running and deploy
1) Create an discord app and cofigure the app as you wish.
2) Configure you .env file in the proyect root with the propper values using this template

    ```bash
    #dBot env
    #GENERIC CONFIG
    PORT=5411
    #DISCORD
    RUN_COMMAND_DEPLOYER=true
    CLIENT_ID=<YOUR_CLIENT_ID>
    GUILD_ID=<YOUR_DISCORD_SERVER_ID>
    BOT_TOKEN=<YOUR_BOT_TOKEN>
    ```

[-] Make sure you have `RUN_COMMAND_DEPLOYER=bool` set it to true when creating new commands or to update existing commands.

3) Install dependencies using `npm i` and run with `node .` at proyect root path

4) Run the command `/wipe` before using any currency related commands (users must interact with the bot before calling `/wipe` or any other command, thus to be make you visible to the bot)

5) Check for logs and verify all systems are initialized like this:

    ```bash
    [2023-06-02T22:29:14.394] [WARN] dBot - SERVICE [[DATABASE]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.395] [WARN] dBot - SERVICE [[LOGGER]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.398] [WARN] dBot - SERVICE [[REST]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.398] [WARN] dBot - SERVICE [[CONTROLLER]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.406] [WARN] dBot - SERVICE [[DISCORD]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.406] [WARN] dBot - SERVICE [[COMMANDDEPLOYER]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.408] [WARN] dBot - SERVICE [[BOTAPP]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.408] [WARN] dBot - SERVICE [[BANK]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.409] [WARN] dBot - SERVICE [[BLACKJACK]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.409] [WARN] dBot - SERVICE [[TICKET]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.409] [WARN] dBot - SERVICE [[VERIFICATION]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.409] [INFO] dBot - BOOSTRAPING AND SEEDING BOT...
    [2023-06-02T22:29:14.410] [WARN] dBot - SERVICE [[BOOTSTRAP]] HAS BEEN STARTED SUCCESFULLY
    [2023-06-02T22:29:14.411] [INFO] dBot - SERVER RUNING IN PORT: 5411
    [2023-06-02T22:29:14.411] [INFO] dBot - STARTED REFRESHING APPLICATION (/) COMMANDS.
    [2023-06-02T22:29:14.985] [INFO] dBot - DISCORD BOT READY =＾● ⋏ ●＾=
    [2023-06-02T22:30:27.836] [INFO] dBot - SUCCESSFULLY RELOADED APPLICATION (/) COMMANDS.
    ```

# Roadmap
## v0.1-ALFA
* Built-in services
    - Logger
    - REST Client
    - Database connectors
        - MongoDB (WIP)
* Embbeds and theme utils
* Ticket and verification system (WIP)
* Currency system
* Games
    - Black jack
