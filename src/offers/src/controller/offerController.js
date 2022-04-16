const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult, check, body } = require('express-validator');
const { base64toImage } = require('../utls/base64toString');
const moment = require('moment')
var ObjectID = require("mongodb").ObjectID;
const {models} = require('../../../database/index')

// const offersModel = require('../model/offerModel');
class OfferController extends MongooseService {
  path = '/offer';
  params = '/:id'
  router = express.Router();
  validation = require('../utls/validations');
  OfferModel = models.offerModel
  // CouponDetailModel = require('../model/coupanDetailModel')
  constructor() {
    super()
    this.intializeRoutes()
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.router.post(this.path, this.validation.authUser, this.AddOffer);
    this.router.get(this.path + '-approve', this.approveOffers)
    this.router.get(this.path + '-pending', this.pendingOffers)
    this.router.get(this.path, this.getOffers);
    this.router.get(this.path + this.params, this.validation.validParam, this.offerDetails);
    this.router.put(this.path + this.params, this.validation.validParam, this.updateOffer);
    this.router.delete(this.path + this.params, this.deleteOffer);
    // this.router.post(this.path + '/checkcode', this.validation.couponValidate, this.validateOffer);

  }

  /*
     GET  offers METHOD 
  */
  getOffers = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.OfferModel);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.OfferModel, options)

      }

      return res.status(200).json({ data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }


  //  /*
  //   GET ALL APPROVE STATUS
  //  
  approveOffers = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        let data = await this.approvelist(this.OfferModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.approvelist(this.OfferModel, options)
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

  pendingOffers = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        let data = await this.pendinglist(this.OfferModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.pendinglist(this.OfferModel, options)
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

  offerDetails = async (req, res) => {
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
        const data = await this.findOne(this.OfferModel, _id);
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

  AddOffer = async (req, res) => {
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
        // console.log(payload.product.isArray); 
        if (payload.offer_type == 'combo') {
          if (!payload.combo) {
            return res.status(422).json({ message: "combo requred" })
          }
          else {
            if (payload.combo.length < 1) {
              return res.status(422).json({ message: "invalid input" })
            }
          }
        }
        else if (payload.offer_type == 'product') {
          if (!payload.product) {
            return res.status(422).json({ message: "product requred" })
          }
          else {
            if (payload.product.length < 1) {
              return res.status(422).json({ message: "invalid input" })
            }
          }
        }
       
        if(payload.offer_image){
          payload['offer_image'] = await  base64toImage(payload.offer_image, "upload/","offer_image"+ Date.now());
        }
        if(payload.offer_banner){
          payload['offer_banner'] = await  base64toImage(payload.offer_banner, "upload/","offer_banner"+ Date.now());
        }
        for (let index = 0; index < payload.combo.length; index++) {
          payload['combo'] = [
            {
              combo_offer_qty:payload.combo[index].combo_offer_qty,
              combo_product_count:payload.combo[index].combo_offer_qty,
              combo_offer_product_id:payload.combo[index].combo_offer_product_id,
              combo_product_banner:await  base64toImage(payload.combo[index].combo_product_banner, "upload/","combo_product_banner"+ Date.now()),
              combo_product_image:await  base64toImage(payload.combo[index].combo_product_image, "upload/","combo_product_image"+ Date.now()),
            }
          ]
        }
        let result = await this.add(this.OfferModel, payload);
        return res.status(200).json({ result: result });

      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

    /*
      UPDATE   offers  DETAILS METHOD  OR Verify offer 
   */

  updateOffer = async (req, res) => {
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
        const update_office = await this.OfferModel.findOne({ _id })
        //  let iconName = 
      if(payload.offer_image){
        payload['offer_image'] = await  base64toImage(payload.offer_image, "upload/","offer_image"+ Date.now());
      }
      if(payload.offer_banner){
        payload['offer_banner'] = await  base64toImage(payload.offer_banner, "upload/","offer_banner"+ Date.now());
      }

        if (payload.offer_type == 'product') {
          console.log(update_office.product[0]._id);
          await this.OfferModel.findOneAndUpdate({ _id, 'product._id': update_office.product[0]._id },
            {
              $set: {
                "product.$.discount_value": payload.discount_value,
              }
            }
          )
        }
        else if(payload.offer_type =='combo'){
        
          var combo_product_banner = await base64toImage(payload.combo_product_banner, "upload/","office_"+ Date.now());
          var combo_product_image = await base64toImage(payload.combo_product_image, "upload/","office_"+ Date.now());
          await this.OfferModel.findOneAndUpdate({_id,'combo._id':update_office.combo[0]._id},
            {
              $set: {
                "combo.$.combo_offer_qty": payload.combo_offer_qty,
                "combo.$.combo_product_count": payload.combo_product_count,
                "combo.$.combo_product_banner": combo_product_banner,
                "combo.$.combo_product_image": combo_product_image,
              }
            })
        }

        //   combo_offer_qty: {
        //     type: Number,
        //     required:true
        // },
        // combo_offer_product_id: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'products',
        //     required:true
        // },
        // combo_product_count: {
        //     type: Number,
        //     required:true
        // },
        // combo_product_banner: {
        //     type: String
        // },
        // combo_product_image: {
        //     type: String,
        //     required:true
        // },

        await this.updateOne(this.OfferModel, _id, payload);

        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  //   /*
  //     DELETE  offers DETAILS METHOD 
  //  */

  deleteOffer = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.OfferModel, id);
      // await this.deleteOne(this.authUserModel, id);
      return res.status(200).json({ message: "delete delete" })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  };

  // Validate offers---

  validateOffer = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        let payload = req.body;
        let order_amount = 500;
        let code = payload.code
        let checkcode = await offersModel.find({ code: code });
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
              // let countUser = await CouponDetailModel.find({user_id})
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
      return res.status(500).json({ error: error })
    }
  }

};





module.exports = OfferController