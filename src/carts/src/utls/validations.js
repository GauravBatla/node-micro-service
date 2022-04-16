const { body, check, param } = require('express-validator');
const mongoose = require('mongoose');
const { db } = require('../model/addToCart');
// const authUserModel = require('../model/coupanDetailModel');
const {models} = require('../../../database/index')

const CartModel = models.addtoCartModel
const vendorProductModel = models.vendorProductModel;

// var collection = mongoose.collection('auth_users');

exports.authUser = [
    // check('user_id').notEmpty().withMessage("This field is required"),
    check('vendor_product_id').notEmpty().withMessage("This feild is required").custom(async(value)=>{
        return vendorProductModel.findOne({_id:value}).then(data=>{
            console.log(data);
            if(!data){
                throw new Error('invalid vendor product id')
            }
        }).catch((err)=>{
            throw new Error('invalid vendor product id')
        })
    }),
    check('quantity').notEmpty().isNumeric({min:1}),

]




exports.couponValidate = [
    check('code').notEmpty().withMessage('required feild').custom((code) => {
        return CartModel.findOne({ code: code }).then(data => {
            if (!data) {
                return Promise.reject('Invalid code')
            }
        })
    }),
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return CartModel.findOne({ _id: id }).then(data => {
            if (!data) {
                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return CartModel.find({ user_id: id }).then(data => {
            if (!data) {
                console.log(data);
                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),


