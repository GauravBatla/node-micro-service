const { body, check, param } = require('express-validator');
const {models} = require('../../../database/index')

const authUserModel = models.authUserModel
const vendorModel = models.deliveryBoyModel


exports.authUser = [
    check('userName').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
    // check('otp').notEmpty().withMessage("This field is required").isNumeric().withMessage('Invalid input type').isLength({min:6,max:6}).withMessage("enter valid detail"),
    check('firstName'),
    check('lastName'),
    check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom(async (value, { req }) => {
        const email = await authUserModel.findOne({ email: value });
        //   console.log();
        if (email) {
            throw new Error('try unique email');
        }
    }),
    check('phone').notEmpty().withMessage("this feild is required").toInt().isLength({ min: 10, max: 10 }).custom(async (phone)=>{
     const data = await authUserModel.findOne({ phone });
        if (data) {
            throw new Error('try unique email');
        }
    }),
    check('password').notEmpty().withMessage('This field is required').isString().withMessage('This field is required'),
    check('confim_password').notEmpty().withMessage('This field is required').isString().withMessage('This field is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    check('address').notEmpty().withMessage("This field is required").isString().withMessage("invalid input type"),
    check('pincode').notEmpty().withMessage("This field is required").isNumeric().withMessage("invalid input type").isLength(6).withMessage("invalid value"),
    check('service_area').notEmpty().withMessage("This feild is required").isString().withMessage("ivalid input type"),
    check('work_from_time').notEmpty().withMessage("This feild is required"),
    check('work_till_time').notEmpty().withMessage("This feild is required"),
    check('adhaarCardFront').notEmpty().withMessage("This feild is required"),
    check('adhaarCardBack').notEmpty().withMessage("This feild is required"),
    check('drivingLiscence').notEmpty().withMessage("This field is required"),
    check('pancard').notEmpty().withMessage("This feild is require"),
    check('bankAccount').notEmpty().withMessage("This feild is required"),
    check('cancelCheque').notEmpty().withMessage("This feild is required"),
    check('bikeRc').notEmpty().withMessage("This feild is required")
]


// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),

exports.categorieUpdate = [
    check('title').isLength({ min: 3 }).custom((value, { req }) => {
        return categorieModel.findOne({ title: value }).then(data => {
            if (data) {
                return Promise.reject('try unique title')
            }
        })
    }),
    check('icon')
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return vendorModel.findOne({ _id: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return authUserModel.findOne({ _id: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]



exports.verifyOtp = [
    check('user_id').notEmpty().withMessage("user id is required").custom((user_id, { req }) => {
        return authUserModel.findOne({ _id: user_id, phone: req.body.phone, mobile_otp: req.body.otp }).then(data => {
            console.log(data);
            if (!data) {
                throw new Error('not verify ')
            }
        })
    }),
    check('phone').notEmpty().withMessage("phone is required"),
    check('otp').notEmpty().withMessage("Otp is required").isLength({ min: 6, max: 6 })
]


// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),

