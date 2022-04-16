const ooderController = require('./src/controller/orderController');
const apps = require('./src/app');
console.log("orders service");
const app = new apps([new ooderController(),], 5021,);
app.listen();
