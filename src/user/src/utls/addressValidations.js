const {body, check ,param} = require('express-validator');
const mongoose = require('mongoose');
const {models} = require('../../../database/index')

const CustomerAddressModel = models.customerAddressModel

// var collection = mongoose.collection('auth_users');
let address_type = [
    'Home',
    'Office'
]

exports.authUser = [
    check('pincode').notEmpty().withMessage("This field is required").isNumeric().withMessage('invalid input feild').isLength({min:6,max:6}),    
    check('house_no').notEmpty().withMessage('This feild is required'),
    check('area').notEmpty().withMessage("This feild is required"),
    check('landmark').notEmpty().withMessage("THis feild is required"),
    check('city').notEmpty().withMessage("This feild is required"),
    check('state').notEmpty().withMessage("This feild is required"),
    check('address_type').notEmpty().isIn(address_type).withMessage("only these value "+address_type)
] 




exports.couponValidate = [
    check('code').notEmpty().withMessage('required feild').custom((code)=>{
        return CustomerAddressModel.findOne({code:code}).then(data=>{
            if(!data){
                return Promise.reject('Invalid code')
            }
        })
    }),
    
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return CustomerAddressModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return CustomerAddressModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
