const express = require('express');


class App {
    adminPermission = require('./middleware/adminPermission');
    jwtToken =  require('./middleware/jwtTokenMiddleware')
    mongooseConnection = require('../config/db')
    modelPermission = require('./middleware/modelPermission')
    constructor(controllers, port) {
        this.app = express();
        this.cors = require('cors')
        // this.json = express.json()
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
        this.app.use(this.cors());
        this.app.use('/api/v1/admin',this.jwtToken,this.adminPermission,this.modelPermission)
    }

    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1/admin', controller.router);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

module.exports = App