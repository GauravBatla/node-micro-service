const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult, check } = require('express-validator');
const { base64toImage } = require('../utls/base64toString');
const moment = require('moment')
var ObjectID = require("mongodb").ObjectID;
const {models} = require('../../../database/index')

// const couponsModel = require('../model/couponsModel');
class VendorController extends MongooseService {
  path = '/coupon';
  params = '/:id'
  router = express.Router();
  adminRouter = express.Router();
  adminRouter = express.Router();
  validation = require('../utls/validations');
  CouponstModel = models.couponsModel
  // CouponDetailModel = require('../model/coupanDetailModel') 
  constructor() {
    super()
    this.intializeRoutes()
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.adminRouter.post(this.path, this.validation.authUser, this.AddCoupon);
    this.adminRouter.get(this.path + '/approve', this.approveCoupons)
    this.adminRouter.get(this.path + '/pending', this.pendingCoupons)
    this.adminRouter.get(this.path, this.getCoupons);
    this.adminRouter.get(this.path + this.params, this.validation.validParam, this.couponDetails);
    this.adminRouter.put(this.path + this.params, this.validation.validParam, this.updateCoupon);
    this.adminRouter.delete(this.path + this.params, this.deleteCoupon);
    //app routes
    this.router.post(this.path + '/checkcode', this.validation.couponValidate, this.validateCoupon)
    this.router.get('/coupons',this.getCoupons)
  }

  /*
     GET  COUPONS METHOD 
  */
  getCoupons = async (req, res) => {
    try {
      // let data = await this.allList(this.CouponstModel)

      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.allList(this.CouponstModel);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.CouponstModel, options)

        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }


  //  /*
  //   GET ALL APPROVE STATUS
  //  
  approveCoupons = async (req, res) => {
    try {

      const { page, limit } = req.query;
      if (!page && !limit) {
        let data = await this.approvelist(this.CouponstModel)
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.approvePaginationlist(this.CouponstModel, options)
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




  //  /*
  //   GET ALL PENDING STATUS
  //  /*

  pendingCoupons = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        let data = await this.pendinglist(this.CouponstModel)
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.pendingPaginationlist(this.CouponstModel, options)
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
  //      GET   VENDOR DETAILS METHOD 
  //  */

  couponDetails = async (req, res) => {
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
        const data = await this.findOne(this.CouponstModel, _id);
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

  AddCoupon = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        // console.log(payload);
        let option = {
          name: payload.name,
          code: payload.code,
          discount_type: payload.discount_type,
          discount_value: payload.discount_value,
          minimum_order_amount: payload.minimum_order_amount,
          maximum_discount: payload.maximum_discount,
          description: payload.description,
          terms_conditions: payload.terms_conditions,
          user_used_count: payload.user_used_count,
          image_path: await base64toImage(payload.image_path, "upload/", moment().format('DDMMYYhhiiss') + "image"),
          banner_path: await base64toImage(payload.banner_path, "upload/", moment().format('DDMMYYhhiiss') + "image"),
          start_date: payload.start_date,
          expiry_date: payload.expiry_date
        }
        console.log(option);
        let user = await this.add(this.CouponstModel, option);
        return res.status(200).json({ result: user });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  //   /*
  //     UPDATE   COUPONS  DETAILS METHOD  OR Verify Vendor
  //  */

  updateCoupon = async (req, res) => {
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
        //  let iconName = 
        await this.updateOne(this.CouponstModel, _id, payload);
        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  //   /*
  //     DELETE  COUPONS DETAILS METHOD 
  //  */

  deleteCoupon = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.CouponstModel, id);
      // await this.deleteOne(this.authUserModel, id);
      return res.status(200).json({ message: "delete delete" })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  };

  // Validate Coupons---

  validateCoupon = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        let payload = req.body;
        let order_amount = req.body.order_amount
        let code = payload.code
        let checkcode = await this.CouponstModel.find({ code: code });
        if (checkcode) {
          let futuredate = checkcode[0].expiry_date
          console.log(futuredate);
          var date = moment(futuredate)
          var now = moment();

          if (now > date) {
            // date is past
            console.log('true');
          } else {
            // date is future 
            if (order_amount >= checkcode[0].minimum_order_amount) {
              return res.json({ grfe: "wdafegr" })
            }
            else {
              return res.status(200).json({
                message: 'minimum order amount ' + checkcode[0].minimum_order_amount
              })
            }
          }
          return res.json({
            checkcode: checkcode
          })
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

};





module.exports = VendorController