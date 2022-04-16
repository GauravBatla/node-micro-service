const settingController = require('./src/controller/settingController');
const {WebViewController} = require('./src/controller/webViewController')
const apps = require('./src/app');
console.log("Setting service");
const app = new apps([new settingController(),new WebViewController()], 5019,);
app.listen();
