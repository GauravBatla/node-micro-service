const {body, check ,param} = require('express-validator');
const mongoose = require('mongoose');
const {models} = require('../../../database/index')

const AreaModel = models.areaModel

// var collection = mongoose.collection('auth_users');

exports.authUser = [
    check('pincode').notEmpty().withMessage("This field is required").isNumeric().withMessage('invalid input feild').isLength({min:6,max:6}),    
] 




exports.couponValidate = [
    check('code').notEmpty().withMessage('required feild').custom((code)=>{
        return AreaModel.findOne({code:code}).then(data=>{
            if(!data){
                return Promise.reject('Invalid code')
            }
        })
    }),
    
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return AreaModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return AreaModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
