const express = require('express');
const {authUserModelPermission,transactionModelPermission} = require('./middleware/modelPermission')

class App {
   
    mongooseConnection = require('../../database/db');
    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.cors = require('cors')
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
        // this.app.use('/api/v1/vender',this.jwtToken)
    }
    initializeControllers(controllers){
        this.app.use('/api/v1/admin',controllers.userController.adminRouter)
        this.app.use('/api/v1/vender', controllers.userController.VenderRoute);
        this.app.use('/api/v1/admin',controllers.userController.router);
        this.app.use('/api/v1/auth', controllers.userController.loginRoute);
        this.app.use('/api/v1',controllers.areaController.router);
        this.app.use('/api/v1',controllers.userController.loginRoute)
    }
    
    // this.app.use('/api/v1/admin',controller.adminRouter);
    // this.app.use('/api/v1/',controller.router);
  
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

module.exports = App



