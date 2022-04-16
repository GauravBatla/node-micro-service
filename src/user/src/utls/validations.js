const { body, check } = require('express-validator');
const {models} = require('../../../database/index')
const bcryptjs = require('bcryptjs')
const authUserModel = models.authUserModel
var text;
function userTypeCheck(type) {
    switch (type) {
        case 'vandor':
            text = 2
            break;
        case 'delivery':
            text = 3
            break;
        default:
            text = 1
    }
}

exports.authUser = [
    check('userName').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
    check('firstName'),
    check('lastName'),
    check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ email: value }).then(email => {
            //   console.log();
            if (email) {
                throw new Error('try unique email')
            }
        })
    }),
    check('phone').notEmpty().isNumeric({min:10,max:10}).custom(async (value,{req})=>{
      return  authUserModel.findOne({ phone: value, user_type: 1 }).then((data)=>{
          if(data){
            throw new Error('try unique number number');
          }
      })
      
    }),
    check('password').notEmpty().withMessage('This field is required').isString().withMessage('This field is required'),
    check('confim_password').notEmpty().withMessage('This field is required').isString().withMessage('This field is required').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })
]


exports.userUpdate = [
    check('isStaff').optional().isBoolean().withMessage('Invalid Input value'),
    check('isSuperuser').optional().isBoolean().withMessage('Invalid Input value'),
    check('isActive').optional().isBoolean().withMessage('Invalid Input value')
]
// isStaff:payload.isStaff,
// isSuperuser:payload.isSuperuser,
// isActive:payload.isActive

exports.userLogin = [
    check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ email: value, }).then(email => {
              console.log(email);
            if (!email) {
                throw new Error('invalid user email address')
            }
            if (email.isActive == false) {
                throw new Error('email not verfiy')
            }
            
        })
    }),
    check('password').notEmpty().withMessage('kjhgf').custom((value, { req }) => {
        return matchPassword(req.body.email, value).then(match => {
            if (match == false) {
                throw new Error('invalid user credentials')

            }
        }).catch(err => {
            if (err) {
                throw new Error('invalid user credentials')
            }
        })
    }),
]



let matchPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        authUserModel.findOne({ email: email, isActive: true }, function (err, user) {
            if (err) {
                reject(err)
            }
            else {
                if (!user) {
                    reject(err)
                    console.log(user, "::::::::::::::::::::::::::::");
                }
                else {

                    // test a matching password
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) {
                            reject(err)
                        }
                        resolve(isMatch)
                        // if(isMatch === false){
                        //     reject(isMatch)
                        //     console.log('Password123:', isMatch); // -&gt; Password123: true
                        // }
                    });
                }
            }
        });
    })
}

let matchPasswordPhone = (phone, password) => {
    return new Promise((resolve, reject) => {
        authUserModel.findOne({ phone: phone, isActive: true }, function (err, user) {
            console.log(user);
            if (err) {
                reject(err)
            }
            else {
                if (!user) {
                    reject(err)
                    console.log(user, "::::::::::::::::::::::::::::");
                }
                else {

                    // test a matching password
                    user.comparePassword(password, function (err, isMatch) {
                        if (isMatch) {
                            console.log("okkkkkkkkkkkk");
                            resolve(true)
                        }
                        reject(false)
                    });
                }
            }
        });
    })
}



exports.deliveryBoyuserLoginOtp = [
    check('phone').notEmpty().withMessage('This field is required').isNumeric({ min: 10, max: 10 }).custom((value, { req }) => {
        console.log(value, req.body);
        return authUserModel.findOne({ phone: value, user_type: 3 }).then(phone => {
            console.log(phone, req.body);
            if (!phone) {
                throw new Error('invalid user credentials')
            }
        })
    }),
    check('mobile_otp').notEmpty().withMessage('This field is required')
        .isNumeric({ min: 10, max: 10 }).withMessage('Invalid Otp')
        .withMessage('Invalid email').custom((value, { req }) => {
            return authUserModel.findOne({ phone: req.body.phone, mobile_otp: value, user_type: 3 }).then(phone => {
                if (!phone) {
                    throw new Error('invalid user credentials')
                }
            })
        }),
]

exports.deliveryBoyuserLoginPassword = [
    check('phone').notEmpty().withMessage('This field is required').isNumeric({ min: 10, max: 10 }).custom((value, { req }) => {
        return authUserModel.findOne({ phone: value, isActive: true }).then(email => {
            //   console.log();
            if (!email) {
                throw new Error('invalid user credentials')
            }
        })
    }),
    check('password').notEmpty().withMessage('kjhgf')
]


exports.venderLogin = [
    check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ email: value, user_type: 2 }).then(phone => {
            console.log(phone, req.body, "??????????");
            if (!phone) {
                throw new Error('invalid user credentials')
            }
        })
    }),
    check('password').notEmpty().withMessage('kjhgf').custom((value, { req }) => {
        return matchPassword(req.body.email, value).then(match => {
            console.log(match, "match");
            if (match == false) {
                throw new Error('invalid user credentials')

            }
        }).catch(err => {
            if (err) {
                throw new Error('invalid user credentials')
            }
        })
    }),
]
exports.deliveryBoyLogin = [
    check('email').notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ email: value, user_type: 3 }).then(phone => {
            console.log(phone, req.body, "??????????");
            if (!phone) {
                throw new Error('invalid user credentials')
            }
        })
    }),
    check('password').notEmpty().withMessage('kjhgf').custom((value, { req }) => {
        return matchPassword(req.body.email, value).then(match => {
            console.log(match, "match");
            if (match == false) {
                throw new Error('invalid user credentials')

            }
        }).catch(err => {
            if (err) {
                throw new Error('invalid user credentials')
            }
        })
    }),
]

exports.forgetPasswordType = [
    check('user_type').notEmpty()
        .withMessage('This field is required')
        .isIn(['vandor', 'user', 'delivery'])
        .withMessage('' + ['vandor', 'user', 'delivery']).custom((value, { req }) => {
            if ('vandor' === 'vandor') req.type = 2;
            if ('user' === 'user') req.type = 1;
            if ('delivery' === 'delivery') req.type = 3;
            //    return true
        }),
]

var user_type_value = 1;
var forget_password_valid_key;

exports.forGetPassword = [
    check('user_type').notEmpty()
        .withMessage('This field is required')
        .isIn(['vandor', 'user', 'delivery'])
        .withMessage('' + ['vandor', 'user', 'delivery']).custom((value, { req }) => {
            if (value) {
                if ('vandor' == value) {
                    user_type_value = 2
                    return true
                }
                else if ('delivery' == value) {
                    user_type_value = 3
                    return true
                }
                else {
                    user_type_value = 1
                    return true
                }
            }
        }),
    check('forget_password_type').notEmpty().withMessage('This field is required').isIn(['email', 'phone']).withMessage(' email and phone').custom((value) => {
        forget_password_valid_key = value;

        return true
    }),
    check('email').optional().notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ email: value, user_type: user_type_value }).then(phone => {
            console.log(phone);
            if (!phone) {
                throw new Error(`invalid user ${forget_password_valid_key}`)
            }
        })
    }),
    check('phone').optional().notEmpty().withMessage('This field is required').isNumeric({ min: 10, max: 10 }).withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ phone: value, user_type: user_type_value }).then(phone => {
            console.log(phone, req.body);

            if (!phone) {
                throw new Error('invalid user phone Number')
            }
        })
    }),

]


exports.channge_password = [
    check('user_type').notEmpty()
        .withMessage('This field is required')
        .isIn(['vandor', 'user', 'delivery'])
        .withMessage('' + ['vandor', 'user', 'delivery']).custom((value, { req }) => {
            console.log(req.body);
            if (value) {
                if ('vandor' == value) {
                    user_type_value = 2
                    return true
                }
                else if ('delivery' == value) {
                    user_type_value = 3
                    return true
                }
                else {
                    user_type_value = 1
                    return true
                }
            }
        }),
    check('forget_password_type').notEmpty().withMessage('This field is required').isIn(['email', 'phone']).withMessage(' email and phone').custom((value) => {
        forget_password_valid_key = value;

        return true
    }),

    check('email').optional().notEmpty().withMessage('This field is required').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ email: value, user_type: user_type_value }).then(phone => {
            console.log(phone);
            if (!phone) {
                throw new Error(`invalid user ${forget_password_valid_key}`)
            }
        })
    }),
    check('email_otp').optional().notEmpty().withMessage('This field is required').isNumeric({ min: 6, max: 6 }).withMessage('Invalid otp').custom((value, { req }) => {
        return authUserModel.findOne({ email_otp: value, user_type: user_type_value, email: req.body.email }).then(phone => {
            console.log(phone);
            if (!phone) {
                throw new Error(`invalid user credentials`)
            }
        })
    }),
    check('mobile_otp').optional().notEmpty().withMessage('This field is required').isNumeric({ min: 6, max: 6 }).withMessage('Invalid otp').custom((value, { req }) => {
        console.log(req.body);
        return authUserModel.findOne({ mobile_otp: value, user_type: user_type_value, phone: req.body.phone }).then(phone => {
            console.log(phone);
            if (!phone) {
                throw new Error(`invalid user credentials`)
            }
        })
    }),
    check('phone').optional().notEmpty().withMessage('This field is required').isNumeric({ min: 10, max: 10 }).withMessage('Invalid email').custom((value, { req }) => {
        return authUserModel.findOne({ phone: value, user_type: user_type_value }).then(phone => {
            console.log(phone, req.body);

            if (!phone) {
                throw new Error('invalid user phone Number')
            }
        })
    }),

    check('password').notEmpty().withMessage('This field is required').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    })
        .withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"),
    check('confirm_password').notEmpty().withMessage('This field is required').custom((value, { req }) => {
        if (value == req.body.password) {
            return true
        }
        else {
            throw new Error('password and confirm password not match')
        }
    })

]


exports.otpVerfiy = [
    //   check('verfiy_type').notEmpty().withMessage('This field is required').isIn(['email','phone']),
    check('phone').optional().notEmpty().isNumeric({ min: 10, max: 10 }).withMessage('invalid phone number').custom((value, { req }) => {
        return authUserModel.findOne({ phone: value }).then((data) => {
            if (!data) {
                throw new Error('Phone Number not found')
            }
        })
    }),
    check("mobile_otp").optional().notEmpty().isNumeric({ max: 6, max: 6 }).custom((value, { req }) => {
        return authUserModel.findOne({ phone: req.body.phone, mobile_otp: value }).then((data) => {
            
            if (!data) {
                throw new Error('invalid user credentials')
            }
        })
    }),
    check('email').optional().notEmpty().isEmail().withMessage('invalid phone number').custom((value, { req }) => {
        return authUserModel.findOne({ email: value }).then((data) => {
            if (!data) {
                throw new Error('email not found')
            }
        })
    }),
    check("email_otp").optional().notEmpty().isNumeric({ max: 6, max: 6 }).custom((value, { req }) => {
        return authUserModel.findOne({ email: req.body.email, email_otp: value }).then((data) => {
            if (!data) {
                throw new Error('invalid user credentials')
            }
        })
    })
]

exports.otpVerfiyEmail = [
    //   check('verfiy_type').notEmpty().withMessage('This field is required').isIn(['email','phone']),
    check('email').optional().notEmpty().isEmail().withMessage('invalid phone number').custom((value, { req }) => {
        return authUserModel.findOne({ email: value }).then((data) => {
            if (!data) {
                throw new Error('email not found')
            }
        })
    }),
    check("email_otp").optional().notEmpty().isNumeric({ max: 6, max: 6 }).custom((value, { req }) => {
        return authUserModel.findOne({ email: req.body.email, email_otp: value }).then((data) => {
            if (!data) {
                throw new Error('invalid user credentials')
            }
        })
    })
]


