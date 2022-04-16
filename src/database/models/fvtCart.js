const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const newSchema = mongoose.Schema({
 
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"order"
    },
    order_status:{
        type:String
    },

}, { timestamps: true })


newSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order_status', newSchema)