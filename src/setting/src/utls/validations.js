const {body, check ,param} = require('express-validator');
const mongoose = require('mongoose');
const {models} = require('../../../database/index')

const SettingModel = models.settingModel

// var collection = mongoose.collection('auth_users');

exports.authUser = [
    check('free_order_count').notEmpty().withMessage("This field is required").isNumeric().withMessage('invalid input feild'),    
    check('minimuum_order_amount').notEmpty().withMessage("This field is required").isNumeric().withMessage('invalid input feild'),    

]




exports.couponValidate = [
    check('code').notEmpty().withMessage('required feild').custom((code)=>{
        return SettingModel.findOne({code:code}).then(data=>{
            if(!data){
                return Promise.reject('Invalid code')
            }
        })
    }),
    
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return SettingModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return SettingModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]


exports.addWebView = [
    check('title').notEmpty(),
    check('html').notEmpty()
]
exports.updateaddWebView = [
    check('title').optional().notEmpty(),
    check('html').optional().notEmpty()
]
// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
