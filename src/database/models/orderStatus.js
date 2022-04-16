const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const newSchema = mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"order",
        default:null
    },
    order_status:{
        type:String,
        default:"ordered",
        default:null
    },
    order_time:{
        type:Date,
        default:null
    },
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"vendor_product",
        default:null
    },
    vendor_time:{
        type:Date,
        default:null
    },
    deliveryBoyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"delivery_boy",
        default:null
    },
    delivery_time:{
       type:Date,
       default:null
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"auth_users",
        default:null
    }

}, { timestamps: true })


newSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order_status', newSchema)