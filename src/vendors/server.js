const vendorsController = require('./src/controller/vendorsController');
const vendorProductController = require('./src/controller/vendorProductController');
const apps = require('./src/app');
console.log("vendors service");

const controller = {
    vendorsController:new vendorsController(),
    vendorProductController: new vendorProductController()
}
const app = new apps(controller, 5002,);
app.listen();
