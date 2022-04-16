const  userController = require('./src/controller/userController');
const AreaController = require('./src/controller/addressController')
const apps = require('./src/app');
console.log('user service');
const list = [
      new userController(),
      new AreaController()
]
const controller ={
      userController:new userController(),
      areaController:new AreaController()
}

const app = new apps(controller,5013);

app.listen();