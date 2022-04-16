const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const bannerSchema = mongoose.Schema({
  
    image: {
        type:String
    },
    isPrimary:{type:Boolean,default:false},
   
}, { timestamps: true })
bannerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('banner',bannerSchema )