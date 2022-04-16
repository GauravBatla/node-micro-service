const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const attribute_family = Schema({
    name: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        default: null
    },
    family_attribute: [{type: Schema.Types.ObjectId,ref: 'attributes' }],
    // group: [
    //     {
    //         group_name: {
    //             type: String,
    //             default: null
    //         },
    //         group_position: {
    //             type: String,
    //             default: null
    //         },
    //         family_attribute: [
    //             {
    //                 attribute_id: {
    //                     type: Schema.Types.ObjectId,
    //                     ref: 'attributes'
    //                 }
    //             }
    //         ],
    //     }
    // ],

    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
});
attribute_family.index({name:"attribute_family",})

// {
//     attribute_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'attributes'
//     }
// }
attribute_family.plugin(mongoosePaginate);
module.exports = mongoose.model('attribute_familys', attribute_family)
