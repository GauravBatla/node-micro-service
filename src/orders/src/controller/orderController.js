
const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult, check, body } = require('express-validator');
const { base64toImage } = require('../utls/base64toString');
const moment = require('moment')
var ObjectID = require("mongodb").ObjectID;
// const offersModel = require('../model/orderModel');

const { models } = require('../../../database/index')

const mongoose = require('mongoose');
const { json } = require('express');
class OfferController extends MongooseService {
  path = '/order';
  params = '/:id'
  router = express.Router();
  jwtToken = require('../middleware/jwtTokenMiddleware')
  validation = require('../utls/validations');
  OrderModel = models.orderModel
  OrderDetail = models.orderDetailsModel
  OrderSatus = models.orderStatus
  addToCart = models.addtoCartModel
  // CouponDetailModel = require('../model/coupanDetailModel')
  constructor() {
    super()
    this.intializeRoutes()
  }

  /*
   All Intialize Routes   
  */
  intializeRoutes() {
    this.router.post(this.path,this.jwtToken, this.validation.authUser, this.createOrder);
    // this.router.get(this.path + '-approve', this.approveOffers)
    // this.router.get(this.path + '-pending', this.pendingOffers)
    this.router.get(this.path, this.getOrders);
    this.router.get('/myOrders',this.jwtToken, this.myOrders);
    this.router.get(this.path + "app", this.jwtToken, this.getUserOrders);
    this.router.get(this.path + '/deatail' + this.params, this.validation.validParam, this.orderProDetails);
    this.router.get(this.path + this.params, this.validation.validParam, this.orderDetails);
    // this.router.put(this.path + this.params, this.validation.validParam, this.updateOffer);
    // this.router.delete(this.path + this.params, this.deleteOffer);
    // this.router.post(this.path + '/checkcode', this.validation.couponValidate, this.validateOffer);
    // ----THIS ROUTE FOR DELIVERY HOME route---//

    // new delivery orders
    this.router.get('/delivery-newOrder', this.jwtToken, this.newOrder)
    // for new order for vendors
    this.router.get('/newOrder-vendor', this.jwtToken, this.newOrderVendor)
    // for Accept order for vendors BY HARSH
    this.router.get('/accept-Order-vendor-list', this.jwtToken, this.acceptOrderVendorList)
    // active delivery orders
    this.router.get('/active-deliverOrder', this.jwtToken, this.activeDeliveryOrders);
    // Accept order by vendor
    this.router.put('/accept-vendor-order', this.acceptVendorOrder)

    //Accept Delivery Order
    this.router.put('/accept-delivery-order', this.jwtToken, this.acceptDeliveryOrder)
    // for delivery 
    this.router.get('/delivery-complete-order', this.jwtToken, this.completeDelivered)
    this.router.post('/confirm-delivered', this.jwtToken, this.validation.Delivered, this.Delivered)
    this.router.get('/test/:id', this.pendingOrderToActiveOrdr)
    this.router.get('/delivery-boy-order-delivery', this.jwtToken, this.completeDelivered)

  }

  /*
     GET  offers METHOD 
  */


  deliveryboyDeliveryOrder = async (req, res) => {
    try {
      let id = req.user_id
      const { page, limit } = req.query;
      const option = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 1
      }
      let dataFilter = [
        { $match: { vendor_status: 1, deliveryBoy_status: 1, delivery_boy_id: mongoose.Types.ObjectId(req.userId) } },

        {
          $lookup: {
            from: 'coupons',
            localField: 'coupan_id',
            foreignField: '_id',
            as: 'coupan_id'
          },
        },
        {
          $lookup: {
            from: 'auth_users',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor_id'
          },
        },
        { $unwind: '$user_id' },
        {
          $lookup: {
            from: 'orderdetails',
            localField: '_id',
            foreignField: 'order_id',
            as: 'product_details'
          },

        },
        { $unwind: '$product_details' },

        {
          $lookup: {
            from: 'orders',
            localField: 'product_details.order_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: '$order' },
        {
          $lookup: {
            from: 'customer-addresses',
            localField: 'order.user_address_id',
            foreignField: '_id',
            as: 'user_address_id_test'
          },
        },

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_address_id_test.user_id',
            foreignField: '_id',
            as: 'user_id_test'
          },

        },
        { $unwind: '$user_address_id_test' },
        {
          $addFields: {
            "user_address_id_test.username": "$user_id_test.userName", "user_address_id_test.email": "$user_id_test.email",
          },
        },
        { $unwind: '$user_address_id_test.username' },
        { $unwind: '$user_address_id_test.email' },
        {
          $addFields: {
            "order.user_address_id": "$user_address_id_test",
          },
        },
        {
          $addFields: {
            "product_details.order": "$order",
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'product_details.order.vendor_id',
            foreignField: '_id',
            as: 'pickup_address'
          },

        },
        { $unwind: '$pickup_address' },
        {
          $project: {
            "user_id": 0,
            "vendor_id": 0,
            // "user_address_id._id":0,

            "order_id": 0,
            "coupan_id": 0,
            "payment_id": 0,
            "delivery_charge": 0,
            "discount_price": 0,
            "total_payble_amount": 0,
            "payment_status": 0,
            "order_status": 0,
            "contact": 0,
            "bank": 0,
            "vpa": 0,

            "wallet": 0,
            "payment_resp": 0,
            "vendor_status": 0,
            "deliveryBoy_status": 0,
            "user_id_test": 0,
            "user_address_id_test": 0,
            "order": 0,
            "product_details.order_id": 0,
            "product_details.order.user_id": 0,
            // "product_details.order.vendor_id":0,
            "product_details.order.user_address_id.user_id": 0,
            // "product_details.vendor_product_id":0,
            "user_address_id": 0,
            "product_details.order.payment_method": 0,
            "product_details.__v": 0,
            "product_details.order.delivery_boy_id": 0,
            "product_details.order.payment_status": 0,
            "product_details.order.order_status": 0,
            "product_details.order.contact": 0,
            "product_details.order.bank": 0,
            "product_details.order.vpa": 0,
            "product_details.order.wallet": 0,
            "product_details.order.payment_resp": 0,
            "product_details.order.vendor_status": 0,
            "product_details.order.deliveryBoy_status": 0,
            "product_details.order.createdAt": 0,
            "product_details.order.updatedAt": 0,
            "product_details.order.coupan_id": 0,
            "product_details.order.payment_id": 0,
            "product_details.order.__v": 0,
            "product_details.order.user_address_id.__v": 0,
            "pickup_address._id": 0,
            "pickup_address.user_id": 0,

            "pickup_address.pincode": 0,
            "pickup_address.gstTin": 0,
            "pickup_address.adhaarCardFront": 0,
            "pickup_address.adhaarCardBack": 0,
            "pickup_address.pancard": 0,
            "pickup_address.bankAccount": 0,
            "pickup_address.cancelCheque": 0,
            "pickup_address.__v": 0,
            // "product_details": {$arrayElemAt:["$product_details",0]},
            "__v": 0,

          }
        }
      ]
      // let data = await this.aggregatePaginate(this.OrderModel, dataFilter, option)
      let data = await this.aggregate(this.OrderModel, dataFilter)
      return res.status(200).json({
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  pendingOrderToActiveOrdr = async (req, res) => {
    try {
      const OrderFilter = [
        { $match: { '_id': mongoose.Types.ObjectId(req.params.id) } },
        // {
        //   $lookup:{
        //     from:"customer-addresses",
        //     localField:"user_address_id",
        //     foreignField:"_id",
        //     as:"userDetails"
        //   }
        // },
        {
          $lookup: {
            from: "vendor_products",
            localField: "vendor_product_id",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $addFields: {
            "product_title": "iphine 6s 32gb"

          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "order_id",
            foreignField: "_id",
            as: "order"
          }
        },
        { $unwind: "$order" },

        {
          $addFields: {
            "product_order_id": "$order.order_id"

          },
        },


        {
          $lookup: {
            from: "customer-addresses",
            localField: "order.user_address_id",
            foreignField: "_id",
            as: "customer_addresses"
          }
        },
        { $unwind: "$customer_addresses" },




        {
          $lookup: {
            from: "auth_users",
            localField: "customer_addresses.user_id",
            foreignField: "_id",
            as: "user_details"
          }
        },
        { $unwind: "$user_details" },

        // {
        //   $addFields: {
        //     "username": "$user_details.userName","user_email":"$user_details.email"

        //   },
        // },
        {
          $lookup: {
            from: "vendors",
            localField: "order.vendor_id",
            foreignField: "user_id",
            as: "test"
          }
        },
        { $unwind: "$test" },
        {
          $lookup: {
            from: "auth_users",
            localField: "test.user_id",
            foreignField: "_id",
            as: "vendor_user_details"
          }
        },
        { $unwind: "$vendor_user_details" },
        {
          $addFields: {
            "vendor_details": {
              "userName": "$vendor_user_details.userName",
              "gst_no": "$test.gstTin",
              "address": "$test.address",
            }

          },
        },
        {
          $addFields: {
            "billing_address": {
              "pincode": "$customer_addresses.pincode",
              "house_no": "$customer_addresses.house_no",
              "area": "$customer_addresses.area",
              "landmark": "$customer_addresses.landmark",
              "city": "$customer_addresses.city",
              "state": "$customer_addresses.state",
              "phone": "7836922127",
              "address_type": "$customer_addresses.address_type",
              "username": "$user_details.userName", "user_email": "$user_details.email"
            }

          },
        },
        {
          $project: {
            "total_price": 1,
            "discount_price": 1,
            "price": 1,
            "offer_id": 1,
            "product_quantity": 1,
            "billing_address": 1,
            "vendor_details": 1,
            "product_order_id": 1,

            "product_title": 1

          }
        }
      ]
      const data = await this.aggregate(this.OrderDetail, OrderFilter)
      res.render('index', { data: data[0] });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }

  completeDelivered = async (req, res) => {
    try {
      let id = req.userId
      const { page, limit } = req.query;
      console.log(id);
      const option = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 1
      }
      // let delivery_id = req.body.delivery_boy_id
      let filterData = [
        { $match: { 'delivery_boy_id': mongoose.Types.ObjectId(id), deliveryBoy_status: 3 }, },
        {
          $lookup: {
            from: 'coupons',
            localField: 'coupan_id',
            foreignField: '_id',
            as: 'coupan_id'
          },
        },
        {
          $lookup: {
            from: 'auth_users',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor_id'
          },
        },

        { $unwind: '$user_id' },
        {
          $lookup: {
            from: 'orderdetails',
            localField: '_id',
            foreignField: 'order_id',
            as: 'product_details'
          },

        },
        { $unwind: '$product_details' },

        {
          $lookup: {
            from: 'orders',
            localField: 'product_details.order_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: '$order' },
        {
          $lookup: {
            from: 'customer-addresses',
            localField: 'order.user_address_id',
            foreignField: '_id',
            as: 'user_address_id_test'
          },
        },

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_address_id_test.user_id',
            foreignField: '_id',
            as: 'user_id_test'
          },

        },
        { $unwind: '$user_address_id_test' },
        {
          $addFields: {
            "user_address_id_test.username": "$user_id_test.userName", "user_address_id_test.email": "$user_id_test.email",
          },
        },
        { $unwind: '$user_address_id_test.username' },
        { $unwind: '$user_address_id_test.email' },
        {
          $addFields: {
            "order.user_address_id": "$user_address_id_test",
          },
        },
        {
          $addFields: {
            "product_details.order": "$order",
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'product_details.order.vendor_id',
            foreignField: 'user_id',
            as: 'pickup_address'
          },

        },
        { $unwind: '$pickup_address' },
        {
          $project: {
            "user_id": 0,
            "vendor_id": 0,
            // "user_address_id._id":0,

            "order_id": 0,
            "coupan_id": 0,
            "payment_id": 0,
            "delivery_charge": 0,
            "discount_price": 0,
            "total_payble_amount": 0,
            "payment_status": 0,
            "order_status": 0,
            "contact": 0,
            "bank": 0,
            "vpa": 0,

            "wallet": 0,
            "payment_resp": 0,
            "vendor_status": 0,
            "deliveryBoy_status": 0,
            "user_id_test": 0,
            "user_address_id_test": 0,
            "order": 0,
            "product_details.order_id": 0,
            "product_details.order.user_id": 0,
            // "product_details.order.vendor_id":0,
            "product_details.order.user_address_id.user_id": 0,
            // "product_details.vendor_product_id":0,
            "user_address_id": 0,
            "product_details.order.payment_method": 0,
            "product_details.__v": 0,
            "product_details.order.delivery_boy_id": 0,
            "product_details.order.payment_status": 0,
            "product_details.order.order_status": 0,
            "product_details.order.contact": 0,
            "product_details.order.bank": 0,
            "product_details.order.vpa": 0,
            "product_details.order.wallet": 0,
            "product_details.order.payment_resp": 0,
            "product_details.order.vendor_status": 0,
            "product_details.order.deliveryBoy_status": 0,
            "product_details.order.createdAt": 0,
            "product_details.order.updatedAt": 0,
            "product_details.order.coupan_id": 0,
            "product_details.order.payment_id": 0,
            "product_details.order.__v": 0,
            "product_details.order.user_address_id.__v": 0,
            "pickup_address._id": 0,
            "pickup_address.user_id": 0,

            "pickup_address.pincode": 0,
            "pickup_address.gstTin": 0,
            "pickup_address.adhaarCardFront": 0,
            "pickup_address.adhaarCardBack": 0,
            "pickup_address.pancard": 0,
            "pickup_address.bankAccount": 0,
            "pickup_address.cancelCheque": 0,
            "pickup_address.__v": 0,
            // "product_details": {$arrayElemAt:["$product_details",0]},
            "__v": 0,
          }
        }
      ]
      // const data = await this.aggregatePaginate(this.OrderModel, filterData, option)
      const data = await this.aggregate(this.OrderModel, filterData, )
      return res.status(200).json({
        data
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  acceptDeliveryOrder = async (req, res) => {
    try {
      console.log(req.body);
      let id = req.body.id
      if (!id) {
        return res.status(422).json({
          message: "invalid order id"
        })
      }
      console.log(id);
      // let delivery_id = req.body.delivery_boy_id
      let deliveryId = req.userId;
      await this.OrderModel.findByIdAndUpdate({ _id: id }, { deliveryBoy_status: 1, delivery_boy_id: deliveryId })
      return res.status(200).json({
        message: "updated"
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      })
    }
  }

  Delivered = async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        })
      }
      else {
        let id = req.body.id
        let deliveryId = req.userId;
        await this.OrderModel.findByIdAndUpdate({ _id: id }, { deliveryBoy_status: 3, delivery_boy_id: deliveryId })
        return res.status(200).json({
          message: "updated"
        })
      }
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  acceptVendorOrder = async (req, res) => {
    try {
      let id = req.body.id
      await this.OrderModel.findByIdAndUpdate({ _id: id }, { vendor_status: 1 })
      return res.status(200).json({
        message: "updated"
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }


  newOrderVendor = async (req, res) => {
    try {
      let id = req.userId;
      console.log(id, "id>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      const { page, limit } = req.query;
      const option = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 1
      }
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
        // {
        //   path: "populate_filter.categories.categorieId",

        // },
        {
          path: "product_id.familyAtrributeId",
          populate: {
            path: 'family_attribute'
          }
        },
        // {
        //   path: "populate_filter.productAttribute.attributeId",

        // }
      ]

      let filterData = [
        {
          $lookup: {
            from: 'customer-addresses',
            localField: 'user_address_id',
            foreignField: '_id',
            as: 'user_address_id'
          },
        },
        { $unwind: '$user_address_id' },
        {
          $lookup: {
            from: 'coupons',
            localField: 'coupan_id',
            foreignField: '_id',
            as: 'coupan_id'
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'vendor_id',
            foreignField: 'user_id',
            as: 'vendor_id'
          },
        },
        { $unwind: '$vendor_id' },

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          },

        },
        { $unwind: '$user_id' },

        {
          $lookup: {
            from: 'orderdetails',
            localField: '_id',
            foreignField: 'order_id',
            as: 'product_details'
          },

        },
        { $unwind: '$product_details' },
        {
          $lookup: {
            from: 'vendor_products',
            localField: 'product_details.vendor_product_id',
            foreignField: '_id',
            as: 'vendor_product'
          },

        },
        { $unwind: '$vendor_product' },
        {
          $lookup: {
            from: 'products',
            localField: 'vendor_product.product_id',
            foreignField: '_id',
            as: 'user_product'
          },

        },
        { $unwind: '$user_product' },

        {
          $lookup: {
            from: 'attributes',
            localField: 'user_product.productAttribute.attributeId',
            foreignField: '_id',
            as: 'product_attributes'
          },

        },



        // {
        //   $addFields: {
        //     user_id: {
        //       $map: {
        //         input: { $zip: { inputs: ["$user_id"] } },
        //         in: { $mergeObjects: "$$this" },
        //       },
        //     },
        //   },
        // },
        { $match: { vendor_status: 0, 'vendor_id.user_id': mongoose.Types.ObjectId(id) } },
      ]
      // let data = await this.aggregatePaginate(this.OrderModel, filterData, option)

      let data = await this.aggregate(this.OrderModel, filterData)
      return res.status(200).json({
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  // for Accept order for vendors BY HARSH
  acceptOrderVendorList = async (req, res) => {
    try {
      let id = req.userId;
      console.log(id, "id>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      const { page, limit } = req.query;
      const option = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 1
      }
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
        // {
        //   path: "populate_filter.categories.categorieId",

        // },
        {
          path: "product_id.familyAtrributeId",
          populate: {
            path: 'family_attribute'
          }
        },
        // {
        //   path: "populate_filter.productAttribute.attributeId",

        // }
      ]

      let filterData = [
        {
          $lookup: {
            from: 'customer-addresses',
            localField: 'user_address_id',
            foreignField: '_id',
            as: 'user_address_id'
          },
        },
        { $unwind: '$user_address_id' },
        {
          $lookup: {
            from: 'coupons',
            localField: 'coupan_id',
            foreignField: '_id',
            as: 'coupan_id'
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'vendor_id',
            foreignField: 'user_id',
            as: 'vendor_id'
          },
        },
        { $unwind: '$vendor_id' },

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          },

        },
        { $unwind: '$user_id' },

        {
          $lookup: {
            from: 'orderdetails',
            localField: '_id',
            foreignField: 'order_id',
            as: 'product_details'
          },

        },
        { $unwind: '$product_details' },
        {
          $lookup: {
            from: 'vendor_products',
            localField: 'product_details.vendor_product_id',
            foreignField: '_id',
            as: 'vendor_product'
          },

        },
        { $unwind: '$vendor_product' },
        {
          $lookup: {
            from: 'products',
            localField: 'vendor_product.product_id',
            foreignField: '_id',
            as: 'user_product'
          },

        },
        { $unwind: '$user_product' },

        {
          $lookup: {
            from: 'attributes',
            localField: 'user_product.productAttribute.attributeId',
            foreignField: '_id',
            as: 'product_attributes'
          },

        },



        // {
        //   $addFields: {
        //     user_id: {
        //       $map: {
        //         input: { $zip: { inputs: ["$user_id"] } },
        //         in: { $mergeObjects: "$$this" },
        //       },
        //     },
        //   },
        // },
        { $match: { vendor_status: 1, 'vendor_id.user_id': mongoose.Types.ObjectId(id) } },
      ]
      // let data = await this.aggregatePaginate(this.OrderModel, filterData, option)

      let data = await this.aggregate(this.OrderModel, filterData)
      return res.status(200).json({
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  activeDeliveryOrders = async (req, res) => {
    try {
      let id = req.user_id
      const { page, limit } = req.query;
      const option = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 1
      }
      let dataFilter = [
        { $match: { vendor_status: 1, deliveryBoy_status: 1, delivery_boy_id: mongoose.Types.ObjectId(req.userId) } },

        {
          $lookup: {
            from: 'coupons',
            localField: 'coupan_id',
            foreignField: '_id',
            as: 'coupan_id'
          },
        },
        {
          $lookup: {
            from: 'auth_users',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor_id'
          },
        },
        { $unwind: '$user_id' },
        {
          $lookup: {
            from: 'orderdetails',
            localField: '_id',
            foreignField: 'order_id',
            as: 'product_details'
          },

        },
        { $unwind: '$product_details' },

        {
          $lookup: {
            from: 'orders',
            localField: 'product_details.order_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: '$order' },
        {
          $lookup: {
            from: 'customer-addresses',
            localField: 'order.user_address_id',
            foreignField: '_id',
            as: 'user_address_id_test'
          },
        },

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_address_id_test.user_id',
            foreignField: '_id',
            as: 'user_id_test'
          },

        },
        { $unwind: '$user_address_id_test' },
        {
          $addFields: {
            "user_address_id_test.username": "$user_id_test.userName", "user_address_id_test.email": "$user_id_test.email",
          },
        },
        { $unwind: '$user_address_id_test.username' },
        { $unwind: '$user_address_id_test.email' },
        {
          $addFields: {
            "order.user_address_id": "$user_address_id_test",
          },
        },
        {
          $addFields: {
            "product_details.order": "$order",
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'product_details.order.vendor_id',
            foreignField: 'user_id',
            as: 'pickup_address'
          },
        },
        { $unwind: '$pickup_address' },
        {
          $project: {
            "user_id": 0,
            "vendor_id": 0,
            // "user_address_id._id":0,

            "order_id": 0,
            "coupan_id": 0,
            "payment_id": 0,
            "delivery_charge": 0,
            "discount_price": 0,
            "total_payble_amount": 0,
            "payment_status": 0,
            "order_status": 0,
            "contact": 0,
            "bank": 0,
            "vpa": 0,

            "wallet": 0,
            "payment_resp": 0,
            "vendor_status": 0,
            "deliveryBoy_status": 0,
            "user_id_test": 0,
            "user_address_id_test": 0,
            "order": 0,
            "product_details.order_id": 0,
            "product_details.order.user_id": 0,
            // "product_details.order.vendor_id":0,
            "product_details.order.user_address_id.user_id": 0,
            // "product_details.vendor_product_id":0,
            "user_address_id": 0,
            "product_details.order.payment_method": 0,
            "product_details.__v": 0,
            "product_details.order.delivery_boy_id": 0,
            "product_details.order.payment_status": 0,
            "product_details.order.order_status": 0,
            "product_details.order.contact": 0,
            "product_details.order.bank": 0,
            "product_details.order.vpa": 0,
            "product_details.order.wallet": 0,
            "product_details.order.payment_resp": 0,
            "product_details.order.vendor_status": 0,
            "product_details.order.deliveryBoy_status": 0,
            "product_details.order.createdAt": 0,
            "product_details.order.updatedAt": 0,
            "product_details.order.coupan_id": 0,
            "product_details.order.payment_id": 0,
            "product_details.order.__v": 0,
            "product_details.order.user_address_id.__v": 0,
            "pickup_address._id": 0,
            "pickup_address.user_id": 0,

            "pickup_address.pincode": 0,
            "pickup_address.gstTin": 0,
            "pickup_address.adhaarCardFront": 0,
            "pickup_address.adhaarCardBack": 0,
            "pickup_address.pancard": 0,
            "pickup_address.bankAccount": 0,
            "pickup_address.cancelCheque": 0,
            "pickup_address.__v": 0,
            // "product_details": {$arrayElemAt:["$product_details",0]},
            "__v": 0,

          }
        }
      ]
      // let data = await this.aggregatePaginate(this.OrderModel, dataFilter, option)
      let data = await this.aggregate(this.OrderModel, dataFilter)
      return res.status(200).json({
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  // newOrder = async (req, res) => {
  //   try {
  //     const { page, limit } = req.query;
  //     const option = {
  //       page: page ? parseInt(page) : 1,
  //       limit: limit ? parseInt(limit) : 1
  //     }
  //     let dataFilter = [
  //       { $match: { vendor_status: 1, deliveryBoy_status: 0 } },
  //       {
  //         $lookup: {
  //           from: 'coupons',
  //           localField: 'coupan_id',
  //           foreignField: '_id',
  //           as: 'coupan_id'
  //         }
  //       },
  //       {
  //         $lookup: {
  //           from: 'auth_users',
  //           localField: 'vendor_id',
  //           foreignField: '_id',
  //           as: 'vendor_id'
  //         },
  //       },

  //       { $unwind: '$user_id' },
  //       {
  //         $lookup: {
  //           from: 'orderdetails',
  //           localField: '_id',
  //           foreignField: 'order_id',
  //           as: 'product_details'
  //         },

  //       },
  //       { $unwind: '$product_details' },

  //       {
  //         $lookup: {
  //           from: 'orders',
  //           localField: 'product_details.order_id',
  //           foreignField: '_id',
  //           as: 'order'
  //         }
  //       },
  //       { $unwind: '$order' },
  //       {
  //         $lookup: {
  //           from: 'customer-addresses',
  //           localField: 'order.user_address_id',
  //           foreignField: '_id',
  //           as: 'user_address_id_test'
  //         },
  //       },

  //       {
  //         $lookup: {
  //           from: 'auth_users',
  //           localField: 'user_address_id_test.user_id',
  //           foreignField: '_id',
  //           as: 'user_id_test'
  //         },

  //       },
  //       { $unwind: '$user_address_id_test' },
  //       {
  //         $addFields: {
  //           "user_address_id_test.username": "$user_id_test.userName", "user_address_id_test.email": "$user_id_test.email",
  //         },
  //       },
  //       { $unwind: '$user_address_id_test.username' },
  //       { $unwind: '$user_address_id_test.email' },
  //       {
  //         $addFields: {
  //           "order.user_address_id": "$user_address_id_test",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           "product_details.order": "$order",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'vendors',
  //           localField: 'product_details.order.vendor_id',
  //           foreignField: 'user_id',
  //           as: 'pickup_address'
  //         },

  //       },
  //       { $unwind: '$pickup_address' },
  //       {
  //         $project: {
  //           "user_id": 0,
  //           "vendor_id": 0,
  //           // "user_address_id._id":0,

  //           "order_id": 0,
  //           "coupan_id": 0,
  //           "payment_id": 0,
  //           "delivery_charge": 0,
  //           "discount_price": 0,
  //           "total_payble_amount": 0,
  //           "payment_status": 0,
  //           "order_status": 0,
  //           "contact": 0,
  //           "bank": 0,
  //           "vpa": 0,

  //           "wallet": 0,
  //           "payment_resp": 0,
  //           "vendor_status": 0,
  //           "deliveryBoy_status": 0,
  //           "user_id_test": 0,
  //           "user_address_id_test": 0,
  //           "order": 0,
  //           "product_details.order_id": 0,
  //           "product_details.order.user_id": 0,
  //           // "product_details.order.vendor_id":0,
  //           "product_details.order.user_address_id.user_id": 0,
  //           // "product_details.vendor_product_id":0,
  //           "user_address_id": 0,
  //           "product_details.order.payment_method": 0,
  //           "product_details.__v": 0,
  //           "product_details.order.delivery_boy_id": 0,
  //           "product_details.order.payment_status": 0,
  //           "product_details.order.order_status": 0,
  //           "product_details.order.contact": 0,
  //           "product_details.order.bank": 0,
  //           "product_details.order.vpa": 0,
  //           "product_details.order.wallet": 0,
  //           "product_details.order.payment_resp": 0,
  //           "product_details.order.vendor_status": 0,
  //           "product_details.order.deliveryBoy_status": 0,
  //           "product_details.order.createdAt": 0,
  //           "product_details.order.updatedAt": 0,
  //           "product_details.order.coupan_id": 0,
  //           "product_details.order.payment_id": 0,
  //           "product_details.order.__v": 0,
  //           "product_details.order.user_address_id.__v": 0,
  //           "pickup_address._id": 0,
  //           "pickup_address.user_id": 0,

  //           "pickup_address.pincode": 0,
  //           "pickup_address.gstTin": 0,
  //           "pickup_address.adhaarCardFront": 0,
  //           "pickup_address.adhaarCardBack": 0,
  //           "pickup_address.pancard": 0,
  //           "pickup_address.bankAccount": 0,
  //           "pickup_address.cancelCheque": 0,
  //           "pickup_address.__v": 0,
  //           // "product_details": {$arrayElemAt:["$product_details",0]},
  //           "__v": 0,

  //           // "user_id._id":0,
  //           //  "user_id.password":0,
  //           //  "user_id.password": 0,
  //           //  "user_id.isActive": 0,
  //           //  "user_id.phone": 0,
  //           //  "user_id.isStaff": 0,
  //           //  "user_id.isSuperuser": 0,
  //           //  "user_id.dateJoined": 0,
  //           //  "user_id.status": 0,
  //           //  "user_id.user_type": 0,
  //           //  "user_id.mobile_verify": 0,
  //           //  "user_id.email_verify": 0,
  //           //  "user_id.email_otp": 0,
  //           //  "user_id.mobile_otp": 0,
  //           //  "user_id.__v":0
  //         }
  //       }
  //     ]
  //     let data = await this.aggregatePaginate(this.OrderModel, dataFilter, option)
  //     return res.status(200).json({
  //       data: data
  //     })
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: error
  //     })
  //   }
  // }
  newOrder = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const option = {
        page: page ? parseInt(page)         : 1,
        limit: limit ? parseInt(limit) : 1
      }
      let dataFilter = [
        { $match: { vendor_status: 1, deliveryBoy_status: 0 } },





        {
          $lookup: {
            from: 'coupons',
            localField: 'coupan_id',
            foreignField: '_id',
            as: 'coupan_id'
          },
        },
        {
          $lookup: {
            from: 'auth_users',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor_id'
          },
        },

        { $unwind: '$user_id' },
        {
          $lookup: {
            from: 'orderdetails',
            localField: '_id',
            foreignField: 'order_id',
            as: 'product_details'
          },

        },
        { $unwind: '$product_details' },

        {
          $lookup: {
            from: 'orders',
            localField: 'product_details.order_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: '$order' },
        {
          $lookup: {
            from: 'customer-addresses',
            localField: 'order.user_address_id',
            foreignField: '_id',
            as: 'user_address_id_test'
          },
        },

        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_address_id_test.user_id',
            foreignField: '_id',
            as: 'user_id_test'
          },

        },
        { $unwind: '$user_address_id_test' },
        {
          $addFields: {
            "user_address_id_test.username": "$user_id_test.userName", "user_address_id_test.email": "$user_id_test.email",
          },
        },
        { $unwind: '$user_address_id_test.username' },
        { $unwind: '$user_address_id_test.email' },
        {
          $addFields: {
            "order.user_address_id": "$user_address_id_test",
          },
        },
        {
          $addFields: {
            "product_details.order": "$order",
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'product_details.order.vendor_id',
            foreignField: 'user_id',
            as: 'pickup_address'
          },

        },
        { $unwind: '$pickup_address' },
        {
          $project: {
            "user_id": 0,
            "vendor_id": 0,
            // "user_address_id._id":0,

            "order_id": 0,
            "coupan_id": 0,
            "payment_id": 0,
            "delivery_charge": 0,
            "discount_price": 0,
            "total_payble_amount": 0,
            "payment_status": 0,
            "order_status": 0,
            "contact": 0,
            "bank": 0,
            "vpa": 0,

            "wallet": 0,
            "payment_resp": 0,
            "vendor_status": 0,
            "deliveryBoy_status": 0,
            "user_id_test": 0,
            "user_address_id_test": 0,
            "order": 0,
            "product_details.order_id": 0,
            "product_details.order.user_id": 0,
            // "product_details.order.vendor_id":0,
            "product_details.order.user_address_id.user_id": 0,
            // "product_details.vendor_product_id":0,
            "user_address_id": 0,
            "product_details.order.payment_method": 0,
            "product_details.__v": 0,
            "product_details.order.delivery_boy_id": 0,
            "product_details.order.payment_status": 0,
            "product_details.order.order_status": 0,
            "product_details.order.contact": 0,
            "product_details.order.bank": 0,
            "product_details.order.vpa": 0,
            "product_details.order.wallet": 0,
            "product_details.order.payment_resp": 0,
            "product_details.order.vendor_status": 0,
            "product_details.order.deliveryBoy_status": 0,
            "product_details.order.createdAt": 0,
            "product_details.order.updatedAt": 0,
            "product_details.order.coupan_id": 0,
            "product_details.order.payment_id": 0,
            "product_details.order.__v": 0,
            "product_details.order.user_address_id.__v": 0,
            "pickup_address._id": 0,
            "pickup_address.user_id": 0,

            "pickup_address.pincode": 0,
            "pickup_address.gstTin": 0,
            "pickup_address.adhaarCardFront": 0,
            "pickup_address.adhaarCardBack": 0,
            "pickup_address.pancard": 0,
            "pickup_address.bankAccount": 0,
            "pickup_address.cancelCheque": 0,
            "pickup_address.__v": 0,
            // "product_details": {$arrayElemAt:["$product_details",0]},
            "__v": 0,

            // "user_id._id":0,
            //  "user_id.password":0,
            //  "user_id.password": 0,
            //  "user_id.isActive": 0,
            //  "user_id.phone": 0,
            //  "user_id.isStaff": 0,
            //  "user_id.isSuperuser": 0,
            //  "user_id.dateJoined": 0,
            //  "user_id.status": 0,
            //  "user_id.user_type": 0,
            //  "user_id.mobile_verify": 0,
            //  "user_id.email_verify": 0,
            //  "user_id.email_otp": 0,
            //  "user_id.mobile_otp": 0,
            //  "user_id.__v":0
          }
        }
      ]
      let data = await this.aggregate(this.OrderModel, dataFilter)
     
      return res.status(200).json({
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }
  myOrders = async (req, res) => {
    try {
      let id = req.userId
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.mYaggregateFilter(this.OrderModel,id);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.OrderModel, options)

      }
      return res.status(200).json({ data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }
  getOrders = async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.aggregateFilter(this.OrderModel);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.OrderModel, options)

      }
      return res.status(200).json({ data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }
  getUserOrders = async (req, res) => {
    try {
      const userid = req.userId;
      const { page, limit } = req.query;
      if (!page && !limit) {
        var filter = [
          {
            $lookup: {
              from: 'customer-addresses',
              localField: 'user_address_id',
              foreignField: '_id',
              as: 'user_address_id'
            },
          },
          {
            $lookup: {
              from: 'coupons',
              localField: 'coupan_id',
              foreignField: '_id',
              as: 'coupan_id'
            },
          },
          {
            $lookup: {
              from: 'auth_users',
              localField: 'vendor_id',
              foreignField: '_id',
              as: 'vendor_id'
            },
          },
          {
            $addFields: {
              vendor_product_id: {
                $map: {
                  input: { $zip: { inputs: ["$vendor_id"] } },
                  in: { $mergeObjects: "$$this" },
                },
              },
            },
          },
          {
            $lookup: {
              from: 'auth_users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_id'
            },

          },
          {
            $lookup: {
              from: 'orderdetails',
              localField: '_id',
              foreignField: 'order_id',
              as: 'product_details'
            },

          },
          {
            $addFields: {
              user_id: {
                $map: {
                  input: { $zip: { inputs: ["$user_id"] } },
                  in: { $mergeObjects: "$$this" },
                },
              },
            },
          },
          { $match: { 'user_id._id': mongoose.Types.ObjectId(req.userId) } },

        ]
        var data = await this.aggregateOrder(this.OrderModel, filter);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.OrderModel, options)

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
        let data = await this.approvelist(this.OrderModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.approvelist(this.OrderModel, options)
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
        let data = await this.pendinglist(this.OrderModel, "none")
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        let data = await this.pendinglist(this.OrderModel, options)
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

  orderProDetails = async (req, res) => {
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
        const data = await this.findOrderDetail(this.OrderDetail, _id);
        return res.status(200).json({ data: data });
      }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }
  orderDetails = async (req, res) => {
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
        const data = await this.findOne(this.OrderModel, _id);
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

  createOrder = async (req, res) => {
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
        console.log();
        var user_id = req.userId;
        // console.log(user_id);
        let findOrder = await this.allList(user_id);
        // return res.send(findOrder)
        if(findOrder.length ==0){
          return res.status(422).json({message:"cart empty"})
        }
        console.log(findOrder);
        var day = moment().format('x');
        let orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000) + day[12] + day[11] + day[10]
        let option = {
          user_id: user_id,
          order_id: orderId,
          vendor_id: findOrder[0].vendor_id,
          user_address_id: payload.user_address_id,
          coupan_id: payload.coupan_id || null,
          payment_method: payload.payment_method
        };
        let order = await this.add(this.OrderModel, option)
        for (let i = 0; i < findOrder.length; i++) {
          let option1 = {
            order_id: order._id,
            vendor_product_id: findOrder[i].vendor_product_id,
            total_price: findOrder[i].total_price,
            discount_price: 0,
            price: findOrder[i].vendor_product_price,
            product_quantity: findOrder[i].quantity
          }
          let result = await this.add(this.OrderDetail, option1)
          await this.add(this.OrderSatus, { order_id: order._id, order_status: "0" })
          console.log(result);
        }
        await this.addToCart.findOneAndDelete({user_id:req.userId})
        return res.json({
          message: "order created"
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  //   /*
  //     UPDATE   offers  DETAILS METHOD  OR Verify offer 
  //  */

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
        //  let iconName = 
        await this.updateOne(this.OrderModel, _id, payload);
        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  //   /*
  //     DELETE  offers DETAILS METHOD 
  //  */

  deleteOffer = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.OrderModel, id);
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