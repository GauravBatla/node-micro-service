const express = require('express');
const MongooseService = require('../service/mongooseService');
const {validationResult} = require('express-validator');
const {models} = require('../../../database/index')

class PermissionController extends MongooseService {
  router = express.Router();
  path='/permission'
  validations =  require('../utls/validations')

  permission = models.authUserModel
  userModelPermission = models.userModelPermission
  authPermission = require('../service/modelPermissionService');
  constructor() {
      super()
      this.authPermission()
    this.intializeRoutes()
  }
  
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
  this.router.get(this.path,this.getPermission);
  this.router.post(this.path,this.validations.addPermission,this.addPermission)
  this.router.post(this.path+'-multi',this.validations.addMultiPermission,this.addMultiPermission)
  // this.router.post(this.path,this.validations.addMultiPermission,this.addMultiPermission)
}

getPermission = async(req,res) =>{
  try {
    console.log(req.query);
    const data = await this.allList(this.permission);
    return res.status(200).json({data:data})
  } catch (error) {
    return res.status(500).json({error:error})
  }
}

addPermission = async(req,res) =>{
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        console.log(req);
    let payload = req.body;
    await this.add(this.userModelPermission,payload);
    return res.status(200).json({message:"add permission"});
      }
  } catch (error) {
    return res.status(500).json({error:error})
  }
}

addMultiPermission = async (req,res) =>{
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
    let payload = req.body;
    let permissionList = req.body.permissionList
    for(var i =0;i<permissionList.length;i++){
       const check_data = await this.userModelPermission.findOne({userId:permissionList[i].userId,permissionId:permissionList[i].permissionId});
       if(check_data){
         return res.status(400).json({error:"err"})
       }
    }
    await this.userModelPermission.insertMany(payload.permissionList)
    return res.status(200).json({message:"add permission",payload});
      }
  } catch (error) {
    return res.status(500).json({error:error})
  }
}

}
module.exports = PermissionController