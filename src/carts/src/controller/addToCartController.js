const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult, check } = require('express-validator');
// const { base64toImage } = require('../utls/base64toString');
const moment = require('moment')
const { models } = require('../../../database/index')

var ObjectID = require("mongodb").ObjectID;
// const Carts = require('../model/addToCart');
class addToCartController extends MongooseService {
  path = '/cart';
  params = '/:id'
  privateRouter = express.Router();
  validation = require('../utls/validations');
  CartModel = models.addtoCartModel;
  vendorProductModel = models.vendorProductModel
  constructor() {
    super()
    this.intializeRoutes()
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.privateRouter.post(this.path, this.validation.authUser, this.AddUpdateCart);
    this.privateRouter.get(this.path, this.getCartDetail);
    // this.privateRouter.put(this.path + this.params, this.validation.validParam, this.updateCart);
    this.privateRouter.get(this.path, this.cardDetails)
  }

  /*
     GET  offers METHOD 
  */
  // getCartDetail = async (req, res) => {
  //   try {
  //     const { page, limit } = req.query;
  //     if (!page && !limit) {
  //       var data = await this.aggregateFilter(this.CartModel);
  //       return res.status(200).json({ data: data })
  //     }
  //     else {
  //       let options = {
  //         page: parseInt(page),
  //         limit: parseInt(limit)
  //       }
  //       var data = await this.CartModel.find({user_id:req.userId})        // var data = await this.aggregatePaginate(this.CartModel, options)
  //     }
  //     return res.status(200).json({ data: data })
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ error: error })
  //   }

  // }

  getCartDetail = async (req, res) => {
    try {
      const { page, limit } = req.query;
      // if (!page && !limit) {
      //   var data = await this.aggregateFilter(this.CartModel);
      //   return res.status(200).json({ data: data })
      // }
      // else {
      //   let options = {
      //     page: parseInt(page),
      //     limit: parseInt(limit)
      //   }
      // }
      let filterdata  = [
        {
          
            $lookup: {
                from: 'vendor_products',
                localField: 'vendor_product_id',
                foreignField: '_id',
                as: 'vendor_products'
            },

        },
        { $unwind : "$vendor_products" },
        {
          $addFields: {
              "product_details":{
                "product_id":"$vendor_products._id",
                "product_name":"test product name",
                "product_images":"$vendor_products.product_images",
                "product_price":"$vendor_products.price",
                "product_discount":"$vendor_products.discount",
                "product_total_price":"$vendor_products.price",
              }
          },
      },
     

      {
        $project:{
          "product_details":1,
          "quantity":1,
          "total_price":1
        }
      }
      ]
     
      const data = await this.aggregate(this.CartModel,filterdata)
      return res.status(200).json({statue:200, data: data })
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
        let data = await this.pendinglist(this.CartModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.pendinglist(this.CartModel, options)
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

  cardDetails = async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   res.status(422).json({
      //     message: errors.msg,
      //     errors: errors.errors
      //   });
      // }
      // else {
      var _id = req.userId
      // const data = await this.CartModel.find( {user_id:_id})
      // let filter = {
      //   $lookup
      // }
      let data = await this.allList(this.CartModel, _id)
      return res.status(200).json({ data: data });
      // }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  // 
  //     ADD   offer   METHOD 
  //  */

  vendorProductDetails = async (req, res) => {
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
        console.log("test");
        const populate_filter = [
          {
            path: "product_id",
            populate: [{
              path: "categories.categorieId"
            }, {
              path: "familyAtrributeId",
              populate: {
                path: "family_attribute"
              }
            }, {
              path: "productAttribute.attributeId"
            }]
          },
          {
            path: "product_id.familyAtrributeId",
            populate: {
              path: 'family_attribute'
            }
          },

        ]
        const data = await this.vendorProductModel.findOne({ _id: _id }).populate(populate_filter)

        return res.status(200).json({ data: data });
      }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  // AddUpdateCart = async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       res.status(422).json({
  //         message: errors.msg,
  //         errors: errors.errors
  //       });
  //     }
  //     else {
  //       const payload = req.body;
  //       payload['user_id'] = req.userId
  //       let findProduct = await this.CartModel.findOne({
  //         $and: [{ 'user_id': payload.user_id },
  //         { 'vendor_product_id': payload.vendor_product_id }]
  //       })
       
  //       const populate_filter = [
  //         {
  //           path: "product_id",
  //           populate: [{
  //             path: "categories.categorieId"
  //           }, {
  //             path: "familyAtrributeId",
  //             populate: {
  //               path: "family_attribute"
  //             }
  //           }, {
  //             path: "productAttribute.attributeId"
  //           }]
  //         },
  //         {
  //           path: "product_id.familyAtrributeId",
  //           populate: {
  //             path: 'family_attribute'
  //           }
  //         },
     
  //       ]
  //       // const data = await this.vendorProductModel.findOne({ _id: vendor_product_id }).populate(populate_filter);
     

  //       // console.log("FIND PRODUCT>> ", findProduct)
  //       if (findProduct == null || findProduct.length == 0) {
  //         // payload['product_data'] =  JSON.stringify(data)
  //         let result = await this.add(this.CartModel, payload);
  //         return res.status(200).json({ result: result });
  //       }
  //       else {
  //         // console.log("000000000000000000000000000 ",findProduct);
  //         var totalQty = findProduct.quantity + 1
  //         console.log(totalQty);
  //         console.log(findProduct._id);
  //         let rs = await this.updateOne(this.CartModel, findProduct._id, { quantity: totalQty });
  //         return res.status(200).json({
  //           message: "updated"
  //         })
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ error: error })
  //   }
  // }

  AddUpdateCart = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
       return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const user_id = req.userId
        const{vendor_product_id,quantity} = req.body;
        var check_cart = await this.CartModel.findOne({user_id,vendor_product_id})
        if(check_cart){
          var update_quantity = check_cart.quantity;
          await this.CartModel.findOneAndUpdate({user_id,vendor_product_id},{quantity:update_quantity+quantity})
        }
        else{
          let options = {
            vendor_product_id,
            user_id,
            quantity
          }
           await this.add(this.CartModel,options)
        }
        var check_cart = await this.CartModel.findOne({user_id,vendor_product_id})
        return res.status(200).json({check_cart})
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }
  // AddUpdateCart = async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       res.status(422).json({
  //         message: errors.msg,
  //         errors: errors.errors
  //       });
  //     }
  //     else {
  //       const payload = req.body;
  //       let findProduct = await this.CartModel.findOne({
  //         $and: [{ 'user_id': req.userId },
  //         { 'vendor_product_id': payload.vendor_product_id }]
  //       })

  //       const populate_filter = [
  //         {
  //           path: "product_id",
  //           populate: [{
  //             path: "categories.categorieId"
  //           }, {
  //             path: "familyAtrributeId",
  //             populate: {
  //               path: "family_attribute"
  //             }
  //           }, {
  //             path: "productAttribute.attributeId"
  //           }]
  //         },
  //         {
  //           path: "product_id.familyAtrributeId",
  //           populate: {
  //             path: 'family_attribute'
  //           }
  //         },

  //       ]
  //       // const data = await this.vendorProductModel.findOne({ _id: vendor_product_id }).populate(populate_filter);


  //       // console.log("FIND PRODUCT>> ", findProduct)
  //       if (findProduct == null || findProduct.length == 0) {
  //         // payload['product_data'] =  JSON.stringify(data)
  //         let result = await this.add(this.CartModel, option);
  //         return res.status(200).json({ result: result });
  //       }
  //       else{
  //         let options = {
  //           vendor_product_id,
  //           user_id,
  //           quantity
  //         }
  //          await this.add(this.CartModel,options)
  //       }
  //       var check_cart = await this.CartModel.findOne({user_id,vendor_product_id})
  //       return res.status(200).json({check_cart})
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ error: error })
  //   }
  // }
  //   /*
  //     UPDATE And Remove  Cart  DETAILS METHOD
  //  */

  updateCart = async (req, res) => {
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
        let findCart = await this.CartModel.findOne({ _id: _id })
        let LiveQty = findCart.quantity;
        // console.log(LiveQty);
        if (req.body.quantity === 'add') {
          LiveQty++
        } else if (req.body.quantity === 'subs') {
          if (LiveQty == 1) {
            let deleted = await this.CartModel.findOneAndDelete({ _id: _id })
            return res.status(200).json({
              message: "deleted"
            })
          }
          LiveQty--
        }
        // console.log(LiveQty+"--");
        await this.updateOne(this.CartModel, _id, { quantity: LiveQty });
        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

}

module.exports = addToCartController