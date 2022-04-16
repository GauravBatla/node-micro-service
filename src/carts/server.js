const addToCartController = require('./src/controller/addToCartController');
const apps = require('./src/app');
console.log("carts service");
const app = new apps([new addToCartController(),], 5011,);
app.listen();
