const areaController = require('./src/controller/areaController');
const apps = require('./src/app');
console.log("Area service");
const app = new apps([new areaController(),], 5009,);
app.listen();
