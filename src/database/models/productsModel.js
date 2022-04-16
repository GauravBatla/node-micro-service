const { timeStamp } = require('console');
const mongoose = require('mongoose');
const Scheam = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
// var mongoosePaginate = require('mongoose-paginate');
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const products = Scheam({
    parentId: {
        type: ObjectId,
        ref: 'products',
        default: null
    },
    productType: {
        type: String,
        default: null
    },
    product_name: {
        type: String,
      
    },
    product_code: {
        type: String,
      
    },

    categories: [
        {
            categorieId: {
                type: ObjectId,
                ref: 'categories',
            },
        },
    ],

    familyAtrributeId: {
        type: ObjectId,
        ref: 'attribute_familys',
    },
    discount:{type:Number,default:0},
    sku: {
        type: String,
        default: null
    },
    description: {
        type: String,
      
    },
    short_description: {
        type: String,
      
    },
    meta_title: {
        type: String,
        default: null
    },
    meta_tags: {
        type: String,
        default: null
    },
    meta_description: {
        type: String,
        default: null
    },
    product_price: {
        type: Number,

    },
    productAttribute: [
        {
            attributeId: {
                type: ObjectId,
                ref: 'attributes',
            },
            attribute_value: {
                type: String,
                default: null
            }
        }
    ],
    images: [                                 
        {
            image: {
                type: String,
                default: null
            },
            is_primary: {
                type: Boolean,
                default: false
            }
        }
    ],
    relatedProducts: [
        {
            productId: {
                type: ObjectId,
                ref: 'products',
                default: null
            },
        }
    ],

    inventory: {
        type: String,
        default: "0"
    },
    editBy: { type: ObjectId },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean, 
        default: false
    },
    product_created_by:{
        type:String,
        
    }
}, { timeStamp: true });


    
// products.pre('save', function(next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

products.plugin(mongoosePaginate);
module.exports = mongoose.model('products', products)


