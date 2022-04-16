const deliveryBoyController = require('./src/controller/deliveryBoyController');
const apps = require('./src/app');
console.log("delivery service");
const app = new apps([new deliveryBoyController(),], 5018,);
app.listen();
