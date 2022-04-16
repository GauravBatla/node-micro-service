 const mongoose = require('mongoose');
 let transtionSchema = mongoose.Schema({
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auth_users',
     },
     amount:{
         type:Number,
         required:true
     },
     desc:{
         type:String,
         default:null
     },
     transaction_id:{
         type:String,
         require:true
     },
     transaction_date:{
         type:String,
         required:true
     },
     transaction_type:{
         type:String,
         required:true
     }
 });

 module.exports = mongoose.model('transaction',transtionSchema)