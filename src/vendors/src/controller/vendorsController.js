const express = require('express');
const MongooseService = require('../service/vendorService');
const { validationResult } = require('express-validator');
const { base64toImage } = require('../utls/base64toString')
const moment = require('moment')
const {models} = require('../../../database/index')

class VendorController extends MongooseService {
  path = '/vendor-register';
  vendorPath = '/vendor/list'
  params = '/:id';
  jwtToken = require('../middleware/jwtTokenMiddleware');
  AdminjwtToken = require('../middleware/jwtTokenMiddleware');
  router = express.Router();
  authRoute = express.Router()
  validation = require('../utls/validations');
  authUserModel = models.authUserModel
  vendorModel = models.vendorModel
  constructor() {
    super()
    this.intializeRoutes()
  }

  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.router.post(this.path, this.validation.authUser, this.vendorRegister);
    this.router.get(this.vendorPath, this.jwtToken, this.AdminjwtToken, this.getVendors);
    this.router.get(this.path + this.params, this.jwtToken, this.AdminjwtToken, this.validation.validParam, this.vendorDetails);
    this.router.put(this.path + this.params, this.jwtToken, this.AdminjwtToken, this.validation.UserValidParam, this.updateVendor)
    this.router.delete(this.path + this.params, this.jwtToken, this.AdminjwtToken, this.deleteVendor);
    // pending vendor list--
    this.router.get('/vendor-pending', this.jwtToken, this.AdminjwtToken, this.getPendingVendors);
    this.router.get('venfor-approve', this.jwtToken, this.AdminjwtToken, this.getApproveVendors);
    this.router.post(this.path + '/verify', this.jwtToken, this.AdminjwtToken, this.validation.verifyOtp, this.verifyOtp);
    this.router.get('/vendor-profile', this.jwtToken, this.getVendorProfile)
    this.router.put('/vendor-profile',this.jwtToken,this.vendorProileUpdate)

  }

  
  vendorProileUpdate = async (req,res) =>{
    try {
      const _id = req.userId;
      const payload = req.body;
      const data = await this.vendorModel.findOneAndUpdate({user_id:_id},payload);
      return res.status(200).json({data})
    } catch (error) {
      return res.status(500).json({error})
    }
  }

  getVendorProfile = async (req, res) => {
    try {
      const user = await this.vendorModel.findOne({ user_id: req.userId,}).populate('user_id')
      // const vendor = await this.vendorModel.findOne({_id:data._id})

      return res.status(200).json({ data: user })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }

  /*
     GET  VENDORS METHOD  
  */
  getVendors = async (req, res) => {
    try {
      let filter = [

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          },
        }

      ]
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.vendorModel, filter);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.vendorModel, filter, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }

  //   /*
  //      GET   VENDOR DETAILS METHOD 
  //  */

  vendorDetails = async (req, res) => {
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

        const data = await this.findOne(this.vendorModel, { _id: _id });
        return res.status(200).json({ data: data });

      }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }
  // 
  //     ADD   VENDOR  METHOD 
  //  */

  vendorRegister = async (req, res) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        console.log(payload);
        let option = {
          userName: payload.userName,
          firstName: payload.firstName | null,
          lastName: payload.lastName | null,
          email: payload.email,
          password: payload.password,
          user_type: 2,// 2- type for vendors,
          phone: payload.phone

        }
        // console.log(option);

        // console.log(payload);
        let user = await this.add(this.authUserModel, option);
        console.log(user);
        let option2 = {
          user_id: user._id,
          address: payload.address,
          pincode: payload.pincode,
          gstTin: payload.gstTin,
          adhaarCardFront: await base64toImage(payload.adhaarCardFront, "upload/", "adhaarCardFront_"+ moment().format('DDMMYYhhiiss')),
          adhaarCardBack: await base64toImage(payload.adhaarCardBack, "upload/","adhaarCardBack_"+ moment().format('DDMMYYhhiiss')),
          // fssaiLiscence: await base64toImage(payload.fssaiLiscence, "upload/", moment().format('DDMMYYhhiiss')),
          pancard: await base64toImage(payload.pancard, "upload/","pancard_"+ moment().format('DDMMYYhhiiss')),
          bankAccount: await base64toImage(payload.bankAccount, "upload/","bankAccount_"+ moment().format('DDMMYYhhiiss')),
          cancelCheque: await base64toImage(payload.cancelCheque, "upload/", "cancelCheque_"+moment().format('DDMMYYhhiiss'))
        };
        console.log(option2);
        let result = await this.add(this.vendorModel, option2);
        return res.status(200).json({ result: result });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }
  //   /*
  //     UPDATE   VENDORS  DETAILS METHOD  OR Verify Vendor
  //  */
  updateVendor = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
       return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var _id = req.params.id;
        let payload = req.body;
        //  let iconName = 
        await this.updateOne(this.authUserModel, _id, payload);
        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  //   /*
  //     DELETE  VENDORS DETAILS METHOD 
  //  */

  deleteVendor = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.vendorModel, id);
      await this.deleteOne(this.authUserModel, id);
      return res.status(200).json({ message: "delete delete" })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }


  getPendingVendors = async (req, res) => {
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
        var data = await this.aggregateFilter(this.vendorModel, filter);
        console.log(data.length);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.vendorModel, filter, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }


  getApproveVendors = async (req, res) => {
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
        var data = await this.aggregateFilter(this.vendorModel, filter);
        console.log(data.length);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.vendorModel, filter, options)
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

// pending vendor product list--



module.exports = VendorController