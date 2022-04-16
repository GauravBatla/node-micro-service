
const mongoose = require('mongoose');


let connect = () =>{
    
    // var connectionString = `mongodb+srv://sachin:XReivM35vXKLqb5Y@cluster0.oiold.mongodb.net/newEcomm?retryWrites=true&w=majority`;4
     var connectionString = "mongodb+srv://sachin:URnb17mqFrVFqnT2@cluster0.fsuun.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    
    // var connectionString = `mongodb+srv://sachin:XReivM35vXKLqb5Y@cluster0.oiold.mongodb.net/bookcare?retryWrites=true&w=majority`;
     mongoose.connect(connectionString);
     mongoose.connection.on('connected', function () {
       
        console.log(("Mongoose default connection is open to ", connectionString));
    });
    mongoose.connection.on('error', function (err) {
        console.log(("Mongoose default connection has occured " + err + " error"));
    });
        mongoose.connection.on('disconnected', function () {
        console.log(("Mongoose default connection is disconnected"));
    });
    
}


// console.log(mongoose.listCollections())
module.exports =  { connect }

