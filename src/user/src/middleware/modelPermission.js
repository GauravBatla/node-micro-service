var mongoose = require('mongoose');
const model_name1 = "auth_users"
const model_name2 = "transaction"
module.exports = {
    authUserModelPermission: (req, res, next) => {
        mongoose.connection.db.collection('user_auth_permissions').aggregate([
            {
                $lookup:
                {
                    from: 'permissions',
                    localField: 'permissionId',
                    foreignField: '_id',
                    as: 'permissions',
                },
            },

            {
                $lookup: {
                    from: 'auth_users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            }
            ,
            { $match: { userId: mongoose.Types.ObjectId(req.userId), permissions: { $elemMatch: { model_name: model_name1, method: req.method } } } },
        ]).toArray().then(data => {
            mongoose.connection.db.collection('auth_users').findOne({ _id: mongoose.Types.ObjectId(req.userId) }).then(result => {
                console.log(result);
                if (result.isSuperuser == true) {
                    next()
                }
                else if (data.length == 0) {
                    return res.status(403).json({ message: "not permission this route" })
                }
                else {
                    next()
                }
            })
        })
    },
    transactionModelPermission: (req, res, next) => {
        mongoose.connection.db.collection('user_auth_permissions').aggregate([
            {
                $lookup:
                {
                    from: 'permissions',
                    localField: 'permissionId',
                    foreignField: '_id',
                    as: 'permissions',
                },
            },

            {
                $lookup: {
                    from: 'auth_users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            }
            ,
            { $match: { userId: mongoose.Types.ObjectId(req.userId), permissions: { $elemMatch: { model_name: model_name2, method: req.method } } } },
        ]).toArray().then(data => {
            mongoose.connection.db.collection('auth_users').findOne({ _id: mongoose.Types.ObjectId(req.userId) }).then(result => {
                console.log(result);
                if (result.isSuperuser == true) {
                    next()
                }
                else if (data.length == 0) {
                    return res.status(403).json({ message: "not permission this route" })
                }
                else {
                    next()
                }
            })
        })
    },

}