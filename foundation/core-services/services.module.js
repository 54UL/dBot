
const { ControllerService } = require('./implementations/controller.service');
const { DataBaseService } = require('./implementations/database.service');
const { LoggerService } = require('./implementations/logger.service');
const { RestService } = require('./implementations/rest.service');

module.exports = [
    DataBaseService,
    LoggerService,
    RestService,
    ControllerService,
]


