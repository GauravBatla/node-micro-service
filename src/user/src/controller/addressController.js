const express = require('express');
const MongooseService = require('../service/addressService');
const { validationResult, check } = require('express-validator');
const {models} = require('../../../database/index')


class AreaController extends MongooseService {
  path = '/address';
  params = '/:id'
  router = express.Router();
  adminRouter = express.Router();
  jwtToken = require('../middleware/jwtTokenMiddleware')
  VenderRoute = express.Router();
  loginRoute = express.Router();
  validation = require('../utls/addressValidations');
  AreaModel = models.customerAddressModel
  constructor() {
    super()
    this.intializeRoutes()
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.router.post(this.path, this.jwtToken, this.validation.authUser, this.AddCustomerAdesss);
    this.router.get(this.path + this.params, this.jwtToken, this.getAddress);
    this.router.get('/test', this.hhh)
    // this.router.get(this.path+this.params,this.validation.validParam,this.addressDetail)
    this.router.put(this.path + this.params, this.jwtToken, this.validation.validParam, this.updateAdress);
    this.router.delete(this.path + this.params, this.jwtToken, this.validation.validParam, this.deleteAdress);
    this.router.get('/user-address',this.jwtToken,this.getUserAddress)
    // this.router.post(this.path+'-verify',this.checkPincode)
  }

  /*
     GET  Area METHOD 
  */
  hhh = async (req, res) => {
    res.send("ok")
  }

 getUserAddress = async (req,res) =>{
   try {
     console.log(req.userId);
     const userId = req.userId;
     const data = await this.AreaModel.find({user_id:userId})
     return res.status(200).json({data})
   } catch (error) {
     return res.status(500).json({error})
   }
 }

  getAddress = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        let id = req.params.id
        var data = await this.aggregateFilter(this.AreaModel, id);
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

  addressDetail = async (req, res) => {
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
        const data = await this.findOne(this.AreaModel, { _id: _id });
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

  AddCustomerAdesss = async (req, res) => {
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
         payload['user_id'] = req.userId
        let result = await this.add(this.AreaModel, payload);
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

  updateAdress = async (req, res) => {
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
        let result = await this.updateOne(this.AreaModel, { _id: _id }, req.body);
        return res.status(200).json({ message: "update area " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  deleteAdress = async (req, res) => {
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
        error: error
      })
    }
  }

  // check pincode

  checkPincode = async (req, res) => {
    try {
      let pincode = req.body.pincode;
      let result = await this.findOne(this.AreaModel, { pincode: pincode });
      //  console.log(result);
      if (!result) {
        return res.json({
          message: "not available for thi area"
        })
      } else {
        return res.status(200).json({
          message: "avlaible delivery area"
        })
      }
    } catch (error) {
      res.status(500).json({
        error: error
      })
    }
  }
}


module.exports = AreaController