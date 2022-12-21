
class DataBaseService {

    constructor() {

    }

    async init(dependency) {
        this.logger = dependency.get("Logger");
    }

    async dispose() {

    }

    async interval() {

    }

    start() {
        try {
            mongoose.connect(process.env.DB_CNN, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            this.logger.info(`DB Online on: ${process.env.DB_CNN}`);
        } catch (error) {
            this.logger.fatal('Ha ocurrido un problema a la DB', error);
            throw new Error('Error en la base de datos');
        }
    }

    stop() {

    }

    getEngine(engineName) {

    }
}


module.exports = { DataBaseService };