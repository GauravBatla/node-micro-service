const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    vendor_product_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'vendor_products'
    },
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'auth_users'
    },
    quantity:{
        type:Number,
        default:1
    },
   
}, { timestamps: true })
module.exports = mongoose.model('carts',cartSchema)