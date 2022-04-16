const mongoose =  require('mongoose');
const orderDetailSchema = new mongoose.Schema({
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orders'
    },
    vendor_product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor_products'
    },
    order_data:{
        type:String
    },
    total_price:{
        type:Number,
        required:true,
        default:11
    },
    discount_price:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:true
    },
    offer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'offers',
        default:null
    },
    product_quantity:{
        type:Number,
        default:1
    },
},{timestamps:true})

module.exports = mongoose.model('orderDetail', orderDetailSchema)