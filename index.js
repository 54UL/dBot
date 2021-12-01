require('dotenv').config();

const app = require("./foundation/dependency-manager");
const appInstance = new app.DepedencyManager();
appInstance.initialize();
