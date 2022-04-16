const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const settingSchema = mongoose.Schema({
    free_order_count:{
        type:Number,
        required:true
    },
    minimuum_order_amount:{
        type:Number,
        required:true
    },
}, { timestamps: true })
settingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('setting', settingSchema)