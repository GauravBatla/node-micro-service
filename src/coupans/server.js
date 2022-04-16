const couponsController = require('./src/controller/coupansController');
const apps = require('./src/app');
console.log("coupons service");
const app = new apps([new couponsController(),], 5003,);
app.listen();
