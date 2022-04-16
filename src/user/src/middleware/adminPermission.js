var jwt = require('jsonwebtoken');
var JWT_SECREATE_kEY = 'test';
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
    try {
        var bearer = req.headers.authorization.split(" ");
        token = bearer[1];
        var decode = jwt.verify(token, JWT_SECREATE_kEY);
        if (decode.userId) {
            req.userId = decode.userId
            mongoose.connection.db.collection('auth_users').findOne({ email: decode.email, isActive: true}).then(user => {
                if (!user) {
                    res.status(401).json({
                        status: 401,
                        message: "Failed to authenticate token."
                    })
                }
                else {
                    if(user.isSuperuser == true){
                        next()
                    }
                    else if(user.isStaff == true){
                        next()
                    }
                    else{
                        res.status(401).json({
                            status: 403,
                            message: "Not permission this route."
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: "Failed to authenticate token."
        })
    }
}
