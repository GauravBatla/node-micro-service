const express = require('express');
// const {connect} = require('../config/db')


class App {
    mongooseConnection = require('../../database/db')
    constructor(controllers, port) {
        this.app = express();
        this.jwtTokenMiddleware = require('./middleware/jwtTokenMiddleware');
        this.adminPermission = require('./middleware/adminPermission');
        this.modelPermission = require('./middleware/modelPermission');
        this.cors = require('cors')
        this.json = express.json()
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.mongooseConnection.connect();
    }
    initializeMiddlewares() {
       
        this.app.use(this.cors())
        this.app.use(express.json());
        this.app.use('/api/v1/admin',this.jwtTokenMiddleware)
    }

    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1/admin', controller.adminRouter);
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

module.exports = App