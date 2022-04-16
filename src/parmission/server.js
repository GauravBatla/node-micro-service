const  PermissionController = require('./src/controller/permissionController');
const apps = require('./src/app');
console.log("permission service");
const app = new apps([new PermissionController(),],5004,);
app.listen();