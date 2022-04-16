const { timeStamp } = require('console');
const mongoose = require('mongoose');
const Scheam = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
// var mongoosePaginate = require('mongoose-paginate');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const referEarn = Scheam({
    userId: {
        type: ObjectId,
        ref: 'auth_users',
        unique:true
    },
    referCode: {
        type: String,
        default: null,
        unique:true
    },
    referCount:{
        type: String,
        default: 0
    },
    url:{
        type:String
    },
    message:{
        type:String,
        
    }
}, { timeStamp: true });


referEarn.plugin(mongoosePaginate);
module.exports = mongoose.model('userReferEarn', referEarn)


