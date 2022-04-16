const {body, check ,param} = require('express-validator');
// const authUserModel = require('../model/coupanDetailModel');
const {models} = require('../../../database/index')

const CouponModel = models.offerModel

const  discount_type = [
    "fixed",
    "percentage"
]

const offer_type = [
    "product",
    "combo"
]


exports.authUser = [
    check('name').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
    // check('product_id').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
    check('cateogry_id'),
    check('offer_type').notEmpty().withMessage('This field is required').isIn(offer_type).withMessage('only accpt ' + offer_type),
    // check('discount_type').notEmpty().withMessage('This field is required').isIn(discount_type).withMessage('only accpt ' + discount_type)
    // .custom((discount_type)=>{
    //     if(discount_type=="fixed"){
    //         console.log("request is fix");
    //     }
    // }),
    check('product.*.discount_type').notEmpty().withMessage('this feild is required').isIn(discount_type).withMessage('only accept' + discount_type),
    check('product.*.discount_value').notEmpty().withMessage('this feild is required'),
    // check('discount_value').notEmpty().withMessage('Validation error'),
    
    check('combo.*.combo_offer_qty').notEmpty().withMessage('Validation error'),
    check('combo.*.combo_offer_product_id').notEmpty()     , //.withMessage('Validation error'),
    check('combo.*.combo_product_count').notEmpty()     , //.withMessage('Validation error'),
    check('combo.*.combo_product_banner').notEmpty(), //.withMessage('Validation error'),
    check('combo.*.combo_product_image').notEmpty()     , //.withMessage('Validation error'),
    check('offer_image').notEmpty().withMessage('Validation error').isString().withMessage("invalid input"),
    check('offer_banner').notEmpty().withMessage('Validation error').isString().withMessage("invalid input"),
    check('terms_conditions').notEmpty().withMessage('Validation error').isString().withMessage("Invalid input"),
    check('start_date').notEmpty().withMessage('Validation error'),
    check('expiry_date').notEmpty().withMessage('Validation error'),
    // check('status').notEmpty().withMessage('Validation error'),
    check('description').notEmpty().withMessage('Validation error').isString().withMessage("invalid input"),
    
] 

// exports.authUser = [
//     check('name').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
//     // check('offer_type').notEmpty().withMessage('This field is required').isIn(offer_type).withMessage('only accpt ' + offer_type),
//     check('discount_type').notEmpty().withMessage('This field is required').isIn(discount_type).withMessage('only accpt ' + discount_type),
//     check('discount_value').notEmpty().withMessage('Validation error'),
//     // check('combo.*.combo_offer_qty').notEmpty(), //.withMessage('Validation error'),
//     // check('combo.*.combo_offer_product_id').notEmpty()     , //.withMessage('Validation error'),
//     // check('combo.*.combo_product_count').notEmpty()     , //.withMessage('Validation error'),
//     // check('combo.*.combo_product_banner').notEmpty(), //.withMessage('Validation error'),
//     // check('combo.*.combo_product_image').notEmpty()     , //.withMessage('Validation error'),
//     check('offer_image').notEmpty().withMessage('Validation error').isString().withMessage("invalid input"),
//     check('offer_banner').notEmpty().withMessage('Validation error').isString().withMessage("invalid input"),
//     check('terms_conditions').notEmpty().withMessage('Validation error').isString().withMessage("Invalid input"),
//     check('start_date').notEmpty().withMessage('Validation error'),
//     check('expiry_date').notEmpty().withMessage('Validation error'),
//     // check('status').notEmpty().withMessage('Validation error'),
//     check('description').notEmpty().withMessage('Validation error').isString().withMessage("invalid input"),
    
// ] 
// product: [
//     {
//         discount_type: {
//             type: String,   //- product ,combo
//         },
//         discount_value: {
//             type: String,

//         },
//     }
// ],


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
