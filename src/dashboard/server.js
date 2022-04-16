const areaController = require('./src/controller/dashboardController');
const {BannerController} = require('./src/controller/bannerController')
const MongoClient = require('mongodb').MongoClient 
const apps = require('./src/app');

console.log("Dashboard service");

const app = new apps([new BannerController()], 5039,);
