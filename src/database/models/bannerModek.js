const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const bannerSchema = mongoose.Schema({
    title: {
        type:String
    },
    url: {
        type:String
    },
    tem_data:{type:String},
   
}, { timestamps: true })
bannerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('banner',bannerSchema )