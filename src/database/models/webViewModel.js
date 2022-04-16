const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema({
  
    title: {
        type:String
    },
    html:{type:String},
   
}, { timestamps: true })
Schema.plugin(mongoosePaginate);
module.exports = mongoose.model('webViewPages',Schema )