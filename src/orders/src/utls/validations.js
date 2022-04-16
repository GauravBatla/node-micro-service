const { body, check, param } = require('express-validator');
// const authUserModel = require('../model/coupanDetailModel');
const {models} = require('../../../database/index')

const OrderModel = models.orderModel
const userAddressModel = models.customerAddressModel
const payment_method = [
    "cod", "wallet", "digital_payment"
]

    
exports.authUser = [
    check('user_address_id').notEmpty().withMessage("This field is required").custom(async(value)=>{
        return userAddressModel.findOne({_id:value}).then((data)=>{
            if(!data){
                throw new Error('invalid user address')
            }
        })
    }),
    check('payment_method').notEmpty().withMessage("this feild is required").isIn(payment_method).withMessage("only feild required  " + payment_method),
    check('coupan_id').optional(),
    check('payment_id').optional(),

]

exports.couponValidate = [
    check('code').notEmpty().withMessage('required feild').custom((code) => {
        return OrderModel.findOne({ code: code }).then(data => {
            if (!data) {
                return Promise.reject('Invalid code')
            }
        })
    }),

]


exports.Delivered = [
    check('id').notEmpty().withMessage('required feild').custom((id) => {
        return OrderModel.findOne({ _id:id }).then(data => {
            if (!data) {
                return Promise.reject('Invalid Order id')
            }
        })
    }),
]

exports.validParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return OrderModel.findOne({ co: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return OrderModel.findOne({ _id: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
