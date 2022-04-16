const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult } = require('express-validator');
const { base64toImage } = require('../utls/base64toString')
const sendOtp = require("../utls/sendOtp")
const moment = require('moment');
const { json } = require('express');
const { models } = require('../../../database/index')

class VendorController extends MongooseService {
  path = '/deliveryboyregister';

  params = '/:id'
  router = express.Router();
  adminUrl = '/admin'
  authRoute = express.Router();
  loginAdmin = express.Router()
  jwtToken = require('../middleware/jwtTokenMiddleware');
  AdminToken = require('../middleware/adminPermission')
  validation = require('../utls/validations');
  // authUserModel = require('../model/authUserModel');
  authUserModel = models.authUserModel
  deliveryBoyModel = models.deliveryBoyModel
  constructor() {
    super()
    this.intializeRoutes()
  }

  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.router.post('/auth/register', this.validation.authUser, this.deliveryBoyRegister);
    this.router.get(this.adminUrl + this.path, this.jwtToken, this.AdminToken, this.getDeliveryboys);
    this.router.get(this.adminUrl + this.path + this.params, this.jwtToken, this.AdminToken, this.validation.validParam, this.deliveryboyDetails);
    this.router.put(this.adminUrl + this.path + this.params, this.jwtToken, this.AdminToken, this.validation.UserValidParam, this.updateDeliveyBoy);
    this.router.delete(this.adminUrl + this.path + this.params, this.jwtToken, this.AdminToken, this.deleteDeliveryboy);
    this.router.post(this.adminUrl + this.path + '/verify', this.jwtToken, this.AdminToken, this.validation.verifyOtp, this.verifyOtp)

    // get approve and pending delivery boys list
    this.router.get('/deliverboy-pending', this.jwtToken, this.getPendingDeliveryboys)
    this.router.get('/deliverboy-approve', this.jwtToken, this.getApproveDeliveryboys)
    this.router.get('/profile', this.jwtToken, this.getProfileDetails)
  }



  getProfileDetails = async (req, res) => {
    try {
      const user = await this.deliveryBoyModel.findOne({ user_id: req.userId }).populate('user_id');
      return res.status(200).json({ user : user })
    } catch (error) {
      return res.status(500), json({ error :error})
    }
  }

  /*
     GET  DeliveryBoys METHOD 
  */


  getDeliveryboys = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.vendorAllList(this.deliveryBoyModel);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.deliveryBoyModel, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }

  //   /*
  //      GET   Delivery DETAILS METHOD 
  //  */

  deliveryboyDetails = async (req, res) => {
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
        return res.status(200).json({ data: data });
      }
    }
    catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  // 
  //     ADD   DeliveyBoys  METHOD 
  //  

  deliveryBoyRegister = async (req, res) => {
    try {
      // console.log(req.body,">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      // const payload = req.body;
      // if(!payload) return res.status(400).json({message:"invalid data "})
      // let option = {
      //   userName: payload.userName,
      //   firstName: payload.firstName | null,
      //   lastName: payload.lastName | null,
      //   email: payload.email,
      //   phone: payload.phone,
      //   password: payload.password,
      //   user_type: 3 // 3- type for delivery boy
      // }
      // let option2 = {
      //   // user_id: user._id,
      //   address: payload.address,
      //   pincode: payload.pincode,
      //   service_area: payload.service_area,
      //   adhaarCardFront: await base64toImage(payload.adhaarCardFront, moment().format('DDMMYYhhiiss') + "1image"),
      //   adhaarCardBack: await base64toImage(payload.adhaarCardBack, moment().format('DDMMYYhhiiss') + "2image"),
      //   drivingLiscence: await base64toImage(payload.drivingLiscence, moment().format('DDMMYYhhiiss') + "3image"),
      //   pancard: await base64toImage(payload.pancard, moment().format('DDMMYYhhiiss') + "4image"),
      //   bankAccount: await base64toImage(payload.bankAccount, moment().format('DDMMYYhhiiss') + "5image"),
      //   cancelCheque: await base64toImage(payload.cancelCheque, moment().format('DDMMYYhhiiss') + "6image"),
      //   bikeRc: await base64toImage(payload.bikeRc, moment().format('DDMMYYhhiiss') + "7image"),
      //   work_from_time: payload.work_from_time,
      //   work_till_time: payload.work_till_time,
      // };
      // console.log(option);
      // console.log(option2);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        let option = {
          userName: payload.userName,
          firstName: payload.firstName | null,
          lastName: payload.lastName | null,
          email: payload.email,
          phone: parseInt(payload.phone),
          password: payload.password,
          user_type: 3 // 3- type for delivery boy
        }

        let option2 = {
          // user_id: user._id,
          address: payload.address,
          pincode: payload.pincode,
          service_area: payload.service_area,
          adhaarCardFront: await base64toImage(payload.adhaarCardFront, moment().format('DDMMYYhhiiss') + "1image"),
          adhaarCardBack: await base64toImage(payload.adhaarCardBack, moment().format('DDMMYYhhiiss') + "2image"),
          drivingLiscence: await base64toImage(payload.drivingLiscence, moment().format('DDMMYYhhiiss') + "3image"),
          pancard: await base64toImage(payload.pancard, moment().format('DDMMYYhhiiss') + "4image"),
          bankAccount: await base64toImage(payload.bankAccount, moment().format('DDMMYYhhiiss') + "5image"),
          cancelCheque: await base64toImage(payload.cancelCheque, moment().format('DDMMYYhhiiss') + "6image"),
          bikeRc: await base64toImage(payload.bikeRc, moment().format('DDMMYYhhiiss') + "7image"),
          work_from_time: payload.work_from_time,
          work_till_time: payload.work_till_time,
        };
        let user = await this.add(this.authUserModel, option);
        // console.log(user);
        option2['user_id'] = user._id
        // console.log(option2);
        let result = await this.add(this.deliveryBoyModel, option2);
        let send = await sendOtp.sendOtp(this.authUserModel, user._id)
        return res.status(200).json({ result: result });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  //   /*
  //     UPDATE   Deliveryboys  DETAILS METHOD  OR Verify Vendor
  //  */

  updateDeliveyBoy = async (req, res) => {
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
        await this.updateOne(this.authUserModel, _id, payload);
        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  //   /*
  //     DELETE  Deliveryboy DETAILS METHOD 
  //  */

  deleteDeliveryboy = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.deliveryBoyModel, id);
      await this.deleteOne(this.authUserModel, id);
      return res.status(200).json({ message: "delete delete" })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  getPendingDeliveryboys = async (req, res) => {
    try {
      let filter = [

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          },
        },
        { $match: { 'user_id.status': 'Pending' } },

      ]
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.deliveryBoyModel, filter);
        console.log(data.length);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.verndorModel, filter, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }
  getApproveDeliveryboys = async (req, res) => {
    try {
      let filter = [

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          },
        },
        { $match: { 'user_id.status': 'approve' } },

      ]
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.deliveryBoyModel, filter);
        console.log(data.length);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.verndorModel, filter, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }

  verifyOtp = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        let id = req.body.user_id;
        let result = await this.updateOne(this.authUserModel, id, { mobile_verify: true });
        const token = await this.jwtToken.sign({ user_id: id }, this.JWT_SECREATE_kEY, { expiresIn: '86765m' });
        return res.status(200).json({
          message: "Verify Successfully",
          token: token
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

};


module.exports = VendorController