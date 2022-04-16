const offersController = require('./src/controller/offerController');
const apps = require('./src/app');
console.log("offers service");
const app = new apps([new offersController(),], 5006,);
app.listen();
