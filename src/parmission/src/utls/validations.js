const {body, check } = require('express-validator');
const {models} = require('../../../database/index')

const userModelPermissionModel = models.userModelPermission

exports.addPermission = [
    check('userId').notEmpty().withMessage('This field is required'),
    check('permissionId').notEmpty().withMessage('This field is required').custom((value,{req})=>{
        return userModelPermissionModel.findOne({userId:req.body.userId,permissionId:value}).then(data=>{
            if(data){
                return Promise.reject('alread exists this  permission')
            }
        });
    })
] 
exports.addMultiPermission = [
    check('permissionList.*.userId').notEmpty().withMessage('This field is required'),
    check('permissionList.*.permissionId').notEmpty().withMessage('This field is required').custom((value,{req})=>{
        console.log(value,"?????????????");
        var value =[];
        var check_permissionId =[];
        var permissionList = req.body.permissionList
        for(var i=0;i<permissionList.length;i++){
        return userModelPermissionModel.findOne({userId:permissionList[i].userId,permissionId:permissionList[i].permissionId}).then(data=>{
            if(data){
                return Promise.reject('alread exists this  permission')
            }
        });
        }
      
      
    })
] 

// modelId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref: 'centers'
// },
// permissionId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref: 'centers'
// }