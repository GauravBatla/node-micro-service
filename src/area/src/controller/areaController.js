const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult, check } = require('express-validator');
const {models} = require('../../../database/index')
class AreaController extends MongooseService {
  path = '/area';
  params = '/:id'
  router = express.Router();
  adminRouter = express.Router();
  validation = require('../utls/validations');
  // AreaModel = require('../model/areaModel');
  AreaModel = models.areaModel

  constructor() {
    super()
    this.intializeRoutes()
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    // this.router.post(this.path, this.validation.authUser, this.AddArea);
    // this.router.get(this.path, this.getAreas);
    // this.router.get(this.path+this.params,this.validation.validParam,this.areaDetail)
    // this.router.put(this.path+this.params, this.validation.validParam, this.updateArea);
    // this.router.delete(this.path+this.params, this.validation.validParam, this.deleteArea);
    this.adminRouter.post(this.path, this.validation.authUser, this.AddArea);
    this.adminRouter.get(this.path, this.getAreas);
    this.adminRouter.get(this.path+this.params,this.validation.validParam,this.areaDetail)
    this.adminRouter.put(this.path+this.params, this.validation.validParam, this.updateArea);
    this.adminRouter.delete(this.path+this.params, this.validation.validParam, this.deleteArea);
    this.router.post(this.path+'-verify',this.checkPincode)
  }

  /*
     GET  Area METHOD 
  */
  getAreas = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.AreaModel);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.AreaModel, options)
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
        let data = await this.pendinglist(this.AreaModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.pendinglist(this.AreaModel, options)
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

  areaDetail = async (req, res) => {
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
        const data = await this.findOne(this.AreaModel, {_id:_id});
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

  AddArea = async (req, res) => {
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
        console.log(payload);
        let result = await this.add(this.AreaModel, {pincode:payload.pincode});
        return res.status(200).json({ result: result });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error })
    }
  }

  //   /*
  //     UPDATE And Remove  Cart  DETAILS METHOD
  //  */

  updateArea = async (req, res) => {
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
        // console.log(payload);
       let result = await this.updateOne(this.AreaModel, {_id:_id},req.body);
        return res.status(200).json({ message: "update area " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  deleteArea = async (req,res)=>{
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
        await this.deleteOne(this.AreaModel, _id);
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
      console.log(req.body);
      const result = await this.AreaModel.findOne({pincode})
       console.log(result);
      //  let result = await this.findOne(this.AreaModel,{pincode:pincode});
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
      console.log(error);
      res.status(500).json({
        error:error
      })
    }
  }
}


module.exports = AreaController