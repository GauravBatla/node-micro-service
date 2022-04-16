var jwt = require('jsonwebtoken');
var JWT_SECREATE_kEY = 'test';
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization);
        var bearer = req.headers.authorization.split(" ");
        token = bearer[1];
        var decode = jwt.verify(token, JWT_SECREATE_kEY);
        if (decode.userId) {
            req.userId = decode.userId
            req.userEmail = decode.email
            mongoose.connection.db.collection('auth_users').findOne({ email: decode.email, isActive: true }).then(data => {
                // console.log(data);
                if (!data) {
                    res.status(401).json({
                        status: 401,
                        message: "Failed to authenticate token."
                    })
                }
                else {
                    next()
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
