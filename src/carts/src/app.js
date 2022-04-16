const express = require('express');


class App {
    mongooseConnection = require('../../database/db')
    constructor(controllers, port) {
        this.app = express();
        this.jwtTokenMiddleware = require('./middleware/jwtTokenMiddleware');
        this.adminPermission =require('./middleware/adminPermission');
        this.modelPermission  = require('./middleware/modelPermission');
        this.cors = require('cors')
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
        this.app.use(express.json());
        this.app.use(this.cors())
        this.app.use('/api/v1/private',this.jwtTokenMiddleware)
    }
    
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1/private',controller.privateRouter);
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

module.exports = App