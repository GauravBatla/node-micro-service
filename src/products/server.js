const  productsController = require('./src/controller/productsController');
const attributeController = require('./src/controller/attributeController');
const attributeFamilyController = require('./src/controller/attributeFamilyController');
const categoriesController = require('./src/controller/categoriesController')
const controller ={
    productsController: new productsController(),
    attributeController: new attributeController(),
    attributeFamilyController: new attributeFamilyController(),
    categoriesController: new categoriesController()
}
const test= [
    new productsController(),
    new attributeController(),
    new attributeFamilyController(),
     new categoriesController()
]
const apps = require('./src/app');
console.log("product service");
const app = new apps(controller,5008,);
app.listen();


  