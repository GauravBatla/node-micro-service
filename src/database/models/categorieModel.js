const { timeStamp } = require('console');
const mongoose = require('mongoose');
const Scheam = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosePaginate = require('mongoose-paginate');


const categories = Scheam({
    parentId:[{
        type:ObjectId,
        ref:'categories',
        default:null
    }],
    title:{
        type:String,
        default:null
    },
    icon:{type:String, default:null},
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted:{
       type:Boolean,
       default:false
    }
},{timeStamp:true});

categories.plugin(mongoosePaginate);


categories.pre('findOneAndUpdate', function (next) {
    const data = this.getUpdate()
    const _id = this.getQuery()
    console.log(data,"update");
    console.log(_id,"q");
    // data.password = 'Teste Middleware'
    // this.update({}, data).exec()
    next()
})

module.exports = mongoose.model('categories',categories)