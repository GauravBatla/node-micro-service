const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const CustomerAdreessSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'auth_users'
    },
    pincode:{
        type:Number,
        required:true
    },
    house_no:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    } ,
    state:{
        type:String,
        required:true
    },
    lat:{
        type:String,
        default:null
    },
    long:{
        type:String,
        default:null
    },
    address_type:{
        type:String,
        default:null
    }
}, { timestamps: true })

CustomerAdreessSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('customer-address', CustomerAdreessSchema)