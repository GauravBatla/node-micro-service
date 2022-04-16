var jwt = require('jsonwebtoken');
var JWT_SECREATE_kEY = 'test';
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
    try {
        var bearer = req.headers.authorization.split(" ");
        token = bearer[1];
        var decode = jwt.verify(token, JWT_SECREATE_kEY);
        req.activeUser = decode
        if (decode.userId) {
            req.userId = decode.userId
            mongoose.connection.db.collection('auth_users').findOne({ email: decode.email, isActive: true}).then(user => {
                if (!user) {
                    res.status(401).json({
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
                            message: "Failed to authenticate invalid user credentials "
                        })
                    }


                    
                }
            })
        }
    } catch (error) {
        res.status(401).json({
            message: "Failed to authenticate token."
        })
    }
}
