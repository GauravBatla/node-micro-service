const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
var mongoosePaginate2 = require('mongoose-paginate');
const vendorProductiSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth_users',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    product_title:{
     type:String
    },
    price: {
        type: Number,
        required: true
    },
    product_images: [
        {
            image: {
                type: String
            },
            is_primary: {
                type: Boolean,
                default: false
            }
        }
    ],
    description:{
        type:String,
        required:true
    },
    short_description:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        default:null
    },
    inventory: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    product_delivery_boy_day:{
        type:Number,
        default:2
    },
    // product_check_return:{
    //     type:Boolean,
    //     default:true
    // },
    // product_return_day:{
    //     type:Number,
    //     default:2
    // },
    // product_tc:{
    //     type:String,

    // }

}, { timestamps: true })
vendorProductiSchema.plugin(mongoosePaginate);
vendorProductiSchema.plugin(mongoosePaginate2)
module.exports = mongoose.model('vendor_product', vendorProductiSchema)