const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const vendorSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auth_users',
        required:true
    },
    profile:{
        type:String,
        default:null
    },
    address:{
        type:String,
        lowercase:true,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    gstTin:{
        type:String,
        required:true
    },
    adhaarCardFront:{
        type:String,
        required:true
    },
    adhaarCardBack:{
        type:String,
        required:true
    },
    fssaiLiscence:{
        type:String,
    },
    pancard:{
        type:String,
        required:true
    },
    bankAccount:{
        type:String,
        required:true
    },
    cancelCheque:{
        type:String,
        required:true
    }
});
vendorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('vendors',vendorSchema)