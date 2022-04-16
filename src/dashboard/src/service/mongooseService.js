const { UserValidParam } = require("../utls/validations")
// var ObjectID = require("mongodb").ObjectID;

// var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
var mongodb = require('mongodb');
var url = '"mongodb+srv://sachin:XReivM35vXKLqb5Y@cluster0.oiold.mongodb.net/newEcomm?retryWrites=true&w=majority';
class MongooseService {
    db
    constructor() { 
     this.url = url;
     this.mongodb = mongodb;
     this.connect

    }
async connect(){
   this.db = await this.mongodb.connect(this.url)
}
async api1(){
        return new Promise((resolve,reject)=>{
         
        })
          
    }
  
      

}

module.exports = MongooseService