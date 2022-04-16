const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const offersSchema = mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'auth_users'
    },
    name: {
        type: String,
        required: true
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    product_category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    },
    offer_type: {
        type: String,
        required: true
    },
    product: [
        {
            discount_type: {
                type: String,   //- fix_price , - precentage
                required:true
            },
            discount_value: { 
                type: String,
                required:true
            },
        }
    ],
    combo: [
        {
            combo_offer_qty: {
                type: Number,
                required:true
            },
            combo_offer_product_id: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required:true
            },
            combo_product_count: {
                type: Number,
                required:true
            },
            combo_product_banner: {
                type: String
            },
            combo_product_image: {
                type: String,
                required:true
            },
        }
    ],
    offer_image: {
        type: String,
    },
    offer_banner: {
        type: String,
        required: true
    },
    terms_conditions: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })




// const offersSchema = mongoose.Schema({
//     user_id: {
//         type:mongoose.Schema.Types.ObjectId,
//         ref: 'auth_users'
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     vendor_product_id:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref: 'vendor_products'
//     },
//     // offer_type: {
//     //     type: String,
//     //     required: true
//     // },
//     // product: [
//         // {
//             discount_type: {
//                 type: String,   //- product ,combo
//                 required:true
//             },
//             discount_value: { 
//                 type: String,
//                 required:true
//             },
//         // }
//     // ],
//     // combo: [
//     //     {
//     //         combo_offer_qty: {
//     //             type: Number,
//     //         },
//     //         combo_offer_product_id: {
//     //             type: Schema.Types.ObjectId,
//     //             ref: 'products'
//     //         },
//     //         combo_product_count: {
//     //             type: Number,
//     //         },
//     //         combo_product_banner: {
//     //             type: String
//     //         },
//     //         combo_product_image: {
//     //             type: String,
//     //         },
//     //     }
//     // ],
//     offer_image: {
//         type: String,
//     },
//     offer_banner: {
//         type: String,
//         required: true
//     },
//     terms_conditions: {
//         type: String,
//         required: true
//     },
//     start_date: {
//         type: Date,
//         required: true
//     },
//     expiry_date: {
//         type: Date,
//         required: true
//     },
//     status: {
//         type: Number,
//         default: 0
//     },
//     description: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true })



offersSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('offers', offersSchema)