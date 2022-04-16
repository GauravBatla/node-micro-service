const express = require('express');
const cors = require('cors')

class App {
    mongooseConnection = require('../../database/db')
    constructor(controllers, port) {
        this.app = express();
        this.path = require('path')
        this.jwtTokenMiddleware = require('./middleware/jwtTokenMiddleware');
        this.adminPermission = require('./middleware/adminPermission');
        this.modelPermission = require('./middleware/modelPermission');
        this.json = express.json()
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.dbConnection();
    }

    dbConnection() {
        this.mongooseConnection.connect();
    }
    initializeMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
        this.app.use(cors())
        this.app.use('', express.static(this.path.join(__dirname, '../upload/')))
    }

    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1', controller.router);
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

module.exports = App
