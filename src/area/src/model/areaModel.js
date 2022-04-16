const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const AreaSchema = mongoose.Schema({
    pincode:{
        type:Number,
        unique:true,
        required:true
    },
    status:{
        type:String,
        default:'active'
    },
}, { timestamps: true })
// AreaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('area', AreaSchema) 