const {body, check ,param} = require('express-validator');
const {models} = require('../../../database/index')

const CouponModel = models.couponsModel

exports.authUser = [
    check('name').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
    check('code').notEmpty().withMessage("This feild is required"),
    check('discount_type').notEmpty().withMessage("This feild is required"),
    check('discount_value').notEmpty().withMessage("This field is required").isNumeric().withMessage("invalid input type"),
    check('minimum_order_amount').notEmpty().withMessage("This field is required").isNumeric().withMessage("invalid input type").withMessage("invalid value"),
    check('maximum_discount').notEmpty().withMessage("This feild is required").isNumeric().withMessage("ivalid input type"),
    check('description').notEmpty().withMessage("This feild is required").isString().withMessage("ivalid input type"),
    check('terms_conditions').notEmpty().withMessage("This feild is required").isString().withMessage("ivalid input type"),
    check('user_used_count').notEmpty().withMessage("This feild is required").isNumeric().withMessage("ivalid input type"),
    check('image_path').notEmpty().withMessage("This feild is required").isString().withMessage("ivalid input type"),
    check('banner_path').notEmpty().withMessage("This feild is required").isString().withMessage("ivalid input type"),
    check('start_date').notEmpty().withMessage("This feild is required").isDate().withMessage("ivalid input type"),
    check('expiry_date').notEmpty().withMessage("This feild is required").isDate().withMessage("ivalid input type"),
] 


// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),

exports.couponValidate = [
    check('code').notEmpty().withMessage('required feild').custom((code)=>{
        return CouponModel.findOne({code:code}).then(data=>{
            if(!data){
                return Promise.reject('Invalid code')
            }
        })
    }),
    
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return CouponModel.findOne({co:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return CouponModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
