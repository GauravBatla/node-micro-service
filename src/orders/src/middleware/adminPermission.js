// var jwt = require('jsonwebtoken');
// var JWT_SECREATE_kEY = 'test';
// const mongoose = require('mongoose');

// module.exports = async (req, res, next) => {
//     try {
//         var bearer = req.headers.authorization.split(" ");
//         token = bearer[1];
//         var decode = jwt.verify(token, JWT_SECREATE_kEY);
//         req.activeUser = decode
//         if (decode.userId) {
//             req.userId = decode.userId
//             mongoose.connection.db.collection('auth_users').findOne({ email: decode.email, isActive: true}).then(user => {
//                 if (!user) {
//                     res.status(401).json({
//                         message: "Failed to authenticate token."
//                     })
//                 }
//                 else {
//                     if(user.isSuperuser == true){
//                         next()
//                     }
//                     else if(user.isStaff == true){
//                         next()
//                     }
//                     else{
//                         res.status(401).json({
//                             message: "Failed to authenticate invalid user credentials "
//                         })
//                     }
//                 }
//             })
//         }
//     } catch (error) {
//         res.status(401).json({
//             message: "Failed to authenticate token."
//         })
//     }
// }
var jwt = require('jsonwebtoken');
var JWT_SECREATE_kEY = 'test';
const {models} = require('../../../database/index')

const authUserModel = models.authUserModel; 



module.exports = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization);
        var bearer = req.headers.authorization.split(" ");
        console.log(bearer);
        token = bearer[1];
        var decode = jwt.verify(token, JWT_SECREATE_kEY);
        console.log(decode);
        if (decode.userId) {
            req.userId = decode.userId
            req.userEmail = decode.email
           const user = await authUserModel.findOne({email:decode.email});
           if(!user){
          return res.status(401).json({
                status: 401,
                message: "Failed to authenticate token."
            })
           }
           next()
            // mongoose.connection.db.collection('auth_users').findOne({ email: decode.email, isActive: true }).then(data => {
            //     console.log(data);
            //     if (!data) {
            //         res.status(401).json({
            //             status: 401,
            //             message: "Failed to authenticate token."
            //         })
            //     }
            //     else {
            //         next()
            //     }
            // })
        }
    } catch (error) {
        console.log(error,"???????????nnn");
        res.status(401).json({
            status: 401,
            message: "Failed to authenticate token."
        })
    }
}
