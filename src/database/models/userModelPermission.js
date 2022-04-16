
var mongoose = require('mongoose');
//Set up default mongoose connection
const userModelPermission = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'auth_users',
        required:true
    },
    permissionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'permissions',
        required:true
    }
});


module.exports = mongoose.model('user_auth_permission',userModelPermission)