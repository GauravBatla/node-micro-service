const mongoose = require('mongoose');
bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;
var mongoosePaginate = require('mongoose-paginate');
const authUser = mongoose.Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
    },
    firstName: {
        type: String,
        lowercase: true,
    },
    lastName: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        lowercase: true,

        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        required: true,
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isSuperuser: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    dateJoined: {
        type: String,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'Pending'
    },
    user_type: {
        type: String,
        default: 1   // 1- user , 2- vendor , 3 - delivery boy
    },
    email_otp: {
        type: Number,

    },
    mobile_otp: {
        type: Number,

    },
    mobile_verify: {
        type: Boolean,
        default: false
    },
    email_verify: {
        type: Boolean,
        default: false
    },

});

authUser.pre('save', function (next) {
    var otp = Math.floor(10000 + Math.random() * 900000);
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            user.email_otp = otp;
            user.mobile_otp = otp
            next();
        });
    });
});

authUser.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
authUser.plugin(mongoosePaginate);

module.exports = mongoose.model('auth_users', authUser)