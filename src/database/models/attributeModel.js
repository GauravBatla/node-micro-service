const { timeStamp } = require('console');
const mongoose = require('mongoose');
const Scheam = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
var mongoosePaginate = require('mongoose-paginate');


const attributes = Scheam({
    name: {
        type: String,
        default: null
    },
    code: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: null
    },
    required: {
        type: Boolean,
        default: false
    },
    option: [
        {
            option_name: {
                type: String
            },
            option_value: {
                type: String
            },
            option_position: {
                type: String
            }

        }
    ],
    isConfigurable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }, isDeleted: {
        type: Boolean,
        default: false
    }
}, { timeStamp: true });



attributes.plugin(mongoosePaginate);


attributes.pre('save', function (next) {
    var attribute = this;
    if (!attribute.isModified('type')) return next();
    if (attribute.type == 'select' && attribute.type == "multiselect") {
        attribute.isConfigurable = true
        attribute.option = []
        console.log(attribute.isConfigurable, "check");
        next()
    }
    attribute.isConfigurable = false
    next()
    // generate a salt

});
attributes.pre('findOneAndUpdate', function (next) {
    var attribute = this;
    var update_value = attribute._update;
    console.log(update_value, "update_value");
    if (update_value.type !== 'select' && update_value.type !== "multiselect") {
        update_value.isConfigurable = false
        update_value.option = []
        next()
    }
    next()
});


module.exports = mongoose.model('attributes', attributes)

// id, name, code, type, required, status, created_at, updated_at