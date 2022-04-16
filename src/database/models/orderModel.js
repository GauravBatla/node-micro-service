const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth_users'
    },
    order_id: {
        type: String,
        required: true
    },
    order_data:{
        type:String
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth_users'
    },
    delivery_boy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'delivery_boys',
        // default:'pending'
    },
    user_address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses',

    },
    coupan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupons',
        default: null
    },
    payment_id: {
        type: String,
        // required:true,
        default: null
    },
    delivery_charge: {
        type: Number,
        default: 0
    },
    discount_price: {
        type: Number,
        default: 0
    },
    total_payble_amount: {
        type: String,
        default: null
    },
    order_date: {
        type: Date,
        default: new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    },
    payment_method: {
        type: String,
        default: 'pending'
    },
    payment_status: {
        type: String,
        default: 'pending'
    },
    order_status: {
        type: String,
        default: 'orderd'
    },
    contact: {
        type: String,
        default: 'pending'
    },
    bank: {
        type: String,
        default: 'pending'
    },
    vpa: {
        type: String,
        default: 'pending'
    },
    wallet: {
        type: String,
        default: null
    },
    payment_resp: {
        type: String,
        default: null
    },
    vendor_status: {
        type: Number,
        default: 1   // 0 - pending , 1 - accept order , 2 -reject order
    },
    deliveryBoy_status: {
        type: Number,
        default: 0   // 0 - pending , 1 - accept delivey , 2 -reject delivery ,3 delivey
    },
    payment_resp: {
        type: String,
        default: null
    },
    


}, { timestamps: true })

orderSchema.pre('save', function (next) {

    var order = this;

    // only hash the password if it has been modified (or is new)
    if (!order.isModified('payment_method')) return next();
    // generate a salt
    if (order.payment_method == "cod") {
        order.order_status = 'complete';
        next()
    }

});




orderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order', orderSchema)