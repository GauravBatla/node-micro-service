const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const cartSchema = mongoose.Schema({
    vendor_product_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'vendor_products'
    },
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'auth_users'
    },
    product_data:{type:String},
    quantity:{
        type:Number,
        default:1
    },
   
}, { timestamps: true })
cartSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('carts', cartSchema)