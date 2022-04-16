const express = require('express');
const cors = require('cors');


class App {
    mongooseConnection = require('../../database/db')
    constructor(controllers, port) {
        this.app = express();
        this.path = require('path');
        this.http = require('http').createServer(this.app);
        this.socketIo = require('./socketIo/activeOrder');
        
        this.jwtTokenMiddleware = require('./middleware/jwtTokenMiddleware');
        this.adminPermission =require('./middleware/adminPermission');
        this.modelPermission  = require('./middleware/modelPermission');
        // this.json = express.json()
        this.port = port;
        this.cors = this.app.use(cors())
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.dbConnection();
    }
    dbConnection() {
        this.mongooseConnection.connect();
    }
    initializeMiddlewares() {
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
        // this.app.use('',express.static(this.path.join(__dirname,'../upload/')))
        this.app.use('',express.static(this.path.join(__dirname,'../upload/')));
        this.socketIo.io(this.http);
       
      
    }
    
    initializeControllers(controllers) {
        this.app.use('/api/v1/admin/',controllers.vendorsController.router);
        this.app.use('/api/v1/vendor',controllers.vendorsController.router);
        this.app.use('/api/v1/vendor/',controllers.vendorProductController.router);
        this.app.use('/api/v1/vendor/',controllers.vendorProductController.router);
        this.app.use('/api/v1/vendor/',controllers.vendorProductController.router);
        this.app.use('/api/v1/auth/',controllers.vendorsController.router);
        this.app.use('/api/v1/',controllers.vendorProductController.router)
    }

    listen() {
        this.http.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

module.exports = App