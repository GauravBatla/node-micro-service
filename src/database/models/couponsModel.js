const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const coupansSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
      type:String,
        required:true,
        unique: true
    },
    discount_type:{
        type:String,
        required:true
    }, 
    discount_value:{
        type:Number,
        required:true
    },
    minimum_order_amount:{
        type:Number,
        required:true
    },
    maximum_discount:{
        required:true,
        type:Number
    },
    description:{
        type:String,
        required:true
    },
    terms_conditions:{ 
        type:String,
        required:true
    },
    user_used_count:{ 
        type:Number,
        required:true
    },
    image_path:{
        type:String,
        required:true
    },
    banner_path:{
        type:String,
        required:true
    },
    start_date:{
        type:String,
        required:true
    },
    expiry_date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default: "pending"
    }
},{timestamps:true})
coupansSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('coupon',coupansSchema)