const express = require('express');
const MongooseService = require('../service/mongooseService');
const {models} = require('../../../database/index')

const { validationResult, check } = require('express-validator');
class AreaController extends MongooseService {
  path = '/setting';
  params = '/:id'
  router = express.Router();
  adminRouter = express.Router();
  validation = require('../utls/validations');
  SettingModel = models.settingModel
  constructor() {
    super()
    this.intializeRoutes()
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.adminRouter.post(this.path, this.validation.authUser, this.AddSetting);
    this.adminRouter.get(this.path, this.getSetting);
    this.adminRouter.get(this.path+this.params,this.validation.validParam,this.settingDetail)
    this.adminRouter.put(this.path + this.params, this.validation.validParam, this.updateSetting);
    this.adminRouter.delete(this.path + this.params, this.validation.validParam, this.deleteSetting);
    // this.router.post(this.path+'-verify',this.checkPincode)
  }

  /*
     GET  Area METHOD 
  */
  getSetting = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.SettingModel);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.SettingModel, options)
        return res.status(200).json({ data: data })

      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }


  //  /*
  //   GET ALL PENDING STATUS
  //  /*

  pendingOffers = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        let data = await this.pendinglist(this.SettingModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.pendinglist(this.SettingModel, options)
        return res.status(200).json({
          result: data
        })

      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error
      })
    }
  }



  //   /* 
  //      GET   offer  DETAILS METHOD 
  //  */

  settingDetail = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var _id = req.params.id;
        const data = await this.findOne(this.SettingModel, {_id:_id});
        return res.status(200).json({ data: data });
      }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  // 
  //     ADD   offer   METHOD 
  //  */

  AddSetting = async (req, res) => {
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
        let result = await this.add(this.SettingModel, payload);
        return res.status(200).json({ result: result });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  //   /*
  //     UPDATE And Remove  Cart  DETAILS METHOD
  //  */

  updateSetting = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var _id = req.params.id;
        let payload = req.body;
        console.log(payload);
       let result = await this.updateOne(this.SettingModel, {_id:_id}, payload);
        return res.status(200).json({ message: "update area " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  deleteSetting = async (req,res)=>{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var _id = req.params.id;
        let payload = req.body;
        await this.deleteOne(this.SettingModel, _id);
        return res.status(200).json({ message: "delete area " });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error:error
      })
    }
  } 
  
  // check pincode

  checkPincode = async (req,res)=>{
    try {
      let pincode = req.body.pincode;
       let result = await this.findOne(this.SettingModel,{pincode:pincode});
      //  console.log(result);
        if(!result){
          return res.json({
            message:"not available for thi area"
          })
        }else{
          return res.status(200).json({
            message:"avlaible delivery area"
          })
        }
    } catch (error) {
      res.status(500).json({
        error:error
      })
    }
  }
}


module.exports = AreaController