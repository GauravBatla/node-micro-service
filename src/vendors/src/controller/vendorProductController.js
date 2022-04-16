const express = require('express');
const MongooseService = require('../service/vendorProductService');
const moment = require('moment')
const { validationResult } = require('express-validator');
const { base64toImage } = require('../utls/base64toString')
const { models } = require('../../../database/index')
var ObjectID = require("mongodb").ObjectID;
const mongoose = require('mongoose')
class VendorController extends MongooseService {
  path = '/vendorproduct';
  params = '/:id'
  router = express.Router();
  adminRouter = express.Router();
  jwtToken = require('../middleware/jwtTokenMiddleware');
  AdminjwtToken = require('../middleware/jwtTokenMiddleware');
  authRoute = express.Router()
  validation = require('../utls/vendorProductsValidations');
  authUserModel = models.authUserModel
  vendorProductModel = models.vendorProductModel
  productsModel = models.productsModel;
  offerModel = models.offerModel;
  vendorModel = models.vendorModel
  constructor() {
    super()
    this.intializeRoutes()
  }

  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.router.post(this.path, this.validation.authUser, this.AddVendorProduct);
    this.router.get(this.path + '/approve', this.jwtToken, this.AdminjwtToken, this.approveVendorproducts) // this.jwtToken, this.AdminjwtToken
    this.router.get(this.path + '/pending', this.jwtToken, this.AdminjwtToken, this.pendingVendorproducts)  //
    this.router.get(this.path, this.jwtToken, this.AdminjwtToken, this.getVendors);
    this.router.get(this.path + this.params, this.jwtToken, this.validation.validParam, this.vendorProductDetails); //
    this.router.put(this.path + this.params, this.validation.validParam, this.updateVendorProduct);
    this.router.delete(this.path + this.params, this.jwtToken, this.AdminjwtToken, this.deleteVendorProduct);

    // for delete vendor product in app use
    this.router.delete(this.path + "/apk" + this.params, this.jwtToken, this.deleteVendorProduct);
    // for user app
    this.router.get(this.path + '-sort', this.jwtToken, this.productPrice)
    // get all  product list by vendor id
    this.router.get(this.path + '/byid' + this.params, this.jwtToken, this.vendorProductByVendorId)
    // get product by categoryId

    this.router.get('/getProductBycategory' + this.params, this.jwtToken, this.productByCategory)
    this.router.get('/products', this.vendorProduct);
    this.router.get('/product-list', this.productListView);
    this.router.get('/vendor-product-list', this.jwtToken, this.vendorActiveProduct)
    this.router.put('/vendor-product-update/:id', this.jwtToken, this.validation.update, this.updateProduct)
    this.router.get('/all-product-list', this.allProductList);
    this.router.get('/product-details/:id', this.validation.productDetailsvalidParam, this.userAppvendorDetails)
    this.router.post('/create-vendor-product', this.jwtToken, this.validation.createVendorProduct, this.createVendorProduct);
    this.router.put('/create-vendor-product/:id', this.jwtToken, this.validation.updateVendorProduct, this.updateVendorProduct);
    // this.router.get('/vendor-product-details/:id',this.vendorAdminProductDetails)


  }



  userAppvendorDetails = async (req, res) => {
    try {
      const _id = req.params.id;
      const productAttribute =[]
      const check_offter = await this.offerModel.findOne({product_id:_id});


      const populateData = [
        {
          path:"product_id",
          populate:{
            path:"productAttribute.attributeId",
            select:"name"
          }
        }
      ]
      const data = await this.vendorProductModel.findOne({_id}).populate(populateData)

      let filter = [    
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          },
        },

        { $match: { "product.parentId": mongoose.Types.ObjectId(data.product_id.parentId)} },
        
       
        
      ]
     


   
      var data1 = await this.aggregateScheam(this.vendorProductModel, filter)
      var temp =[];
    
      data1.map((item)=>{
        // console.log(item);
        temp.push(item._id)
      });
      console.log(temp);
   
     
      const bb = await this.vendorProductModel.find({"_id":temp}).populate(
        [
         { 
           path:"product_id",
           select:"productAttribute",
           populate:[
             {
               path:"productAttribute.attributeId",
             
            
             }
           ]
        },
         
        ]
      ).select('price  discount inventory' )
      const vendorDetails = await this.vendorModel.findOne({user_id:data.user_id}).select('address pincode')
      return res.status(200).json({data, productAttribute:bb,vendorDetails})
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }


  createVendorProduct = async (req, res) => {
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
        payload['user_id'] = req.userId
        console.log(payload);
        // let options = {}
        // options['price'] = payload.price
        // options['product_id'] = payload.product_id;
        // options['product_title'] = payload.product_title;
        // options['description'] = payload.description;
        // options['short_description'] = payload.short_description
        // options['discount'] = payload.discount
        // options['inventory'] = payload.inventory
        const data = await this.add(this.vendorProductModel, payload);
        console.log(data);
        return res.status(200).json({ message: "create vendor product" });
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }

  updateVendorProduct = async (req, res) => {
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
        const _id = req.params.id;
        payload['user_id'] = req.userId
        console.log(payload);

        const data = await this.vendorProductModel.findOneAndUpdate({ _id }, payload)
        console.log(data);
        return res.status(200).json({ message: "create vendor update" });
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }

  vendorAdminProductDetails = async (req, res) => {
    try {
      const _id = req.params.id;
      let querys = {

      }
      const { limit, page } = req.query
      const populate_filter = [
        {
          // path: "product_id",
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
      let option = {
        populate: populate_filter,
        limit: limit ? parseInt(limit) : 2,
        page: page ? parseInt(page) : 1
      }
      console.log(_id);
      const data = await this.productsModel.findOne({ _id: _id }).populate(populate_filter)
      // const data = await this.listPaginate(this.productsModel,querys,option)
      console.log(data);
      return res.status(200).json({ data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }
  allProductList = async (req, res) => {
    try {
      const { page, limit } = req.query
      const productFilter = [
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product_id"
          }
        },
        { $unwind: '$product_id' },

        {
          $addFields: {
            "product_name": "$product_id.product_name", "productId": "$product_id._id"

          },
        },
        {
          $addFields: {
            "delivery_status": "free"

          },
        },
        {
          $project: {
            "product_id": 0
          }
        }

      ]
      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10
      }

      const data = await this.aggregatePaginate(this.vendorProductModel, productFilter, options);
      return res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }


  // allProductListFilter = async (req,res) =>{
  //   try {
  //     const {page,limit} = req.query
  //     // const _id = req.params;
  //     const productFilter = [
  //       {
  //         $lookup:{
  //           from:"products",
  //           localField:"product_id",
  //           foreignField:"_id",
  //           as:"product_id"
  //         }
  //       },
  //       { $unwind: '$product_id' },
  //      {$match:{
  //        "product_id.categories.categorieId":
  //      }},
  //       {
  //         $addFields: {
  //           "product_name": "$product_id.product_name","productId":"$product_id._id"

  //         },
  //       },
  //       {$project:{
  //         "product_id":0
  //       }}

  //     ] 
  //     const options={
  //       page:page?parseInt(page):1,
  //       limit:limit?parseInt(limit):10
  //     }

  //     const data = await this.aggregatePaginate(this.vendorProductModel,productFilter,options);
  //     return res.status(200).json({data})
  //   } catch (error) {
  //     return res.status(500).json({error})
  //   }
  // }

  updateProduct = async (req, res) => {
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
        console.log(req.body);
        console.log(req.params);
        const product_check = await this.productsModel.findOne({ _id });
        if (product_check.parentId) {
          var payload = req.body;
          var productId = product_check.parentId;
          var attributeIdTemp = [];
          var attribute_valueTemp = []
          if (payload.productAttribute) {

            payload.productAttribute.forEach(item => {
              attributeIdTemp.push(item.attributeId);
              attribute_valueTemp.push(item.attribute_value)
            });

            var product_exist = false;
            // var productId = "61e2c128a0388572068afd82";
            var arryproduct = [];
            for (var i = 0; i < payload.productAttribute.length; i++) {
              var temparry = []
              var filter = { parentId: productId, "productAttribute": { $elemMatch: payload.productAttribute[i] } }
              if (i > 0) {
                filter['_id'] = { $in: arryproduct }
              }
              const check_product = await this.productsModel.find(filter).select('_id');

              for (var j = 0; j < check_product.length; j++) {
                temparry.push(check_product[j]._id)

              }
              arryproduct = temparry

              if (payload.productAttribute.length - 1 == i) {
                if (check_product.length > 0) {
                  product_exist = true;
                  i = payload.productAttribute.length;
                }
              }
            }
            if (product_exist) {
              return res.status(400).json({ message: "This product is already exist" })
            }
          }
        }
        var payload = req.body;
        if (payload.images) {
          const updateImages = [...payload.images];
          delete payload.images;
          for (let i = 0; i < updateImages.length; i++) {
            updateImages[i].image = await base64toImage(updateImages[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
            updateImages[i].is_primary = updateImages[i].is_primary
            let productUpdate = await this.productsModel.findOneAndUpdate({ _id }, { $push: { images: updateImages } });

            await this.vendorProductModel.findOneAndUpdate({ product_id: productUpdate._id }, {
              $push: {
                product_images: updateImages
              }
            })

          }
          console.log(payload, "payload");
          let productUpdate = await this.productsModel.findOneAndUpdate({ _id }, payload);

          let productUpdate_options1 = {
            price: productUpdate.product_price,
            description: productUpdate.description,
            short_description: productUpdate.short_description,
            discount: productUpdate.discount ? productUpdate.discount : 0,
            inventory: productUpdate.inventory,
          }
          //  console.log(options,"?????????????????");
          await this.vendorProductModel.findOneAndUpdate({ product_id: productUpdate._id }, productUpdate_options1)
          return res.status(200).json({ data: "update product" })
        }

        let data = await this.productsModel.findOneAndUpdate({ _id: _id }, payload)
        let options = {
          price: data.product_price,
          description: data.description,
          short_description: data.short_description,
          discount: data.discount ? data.discount : 0,
          inventory: data.inventory,


        }

        await this.vendorProductModel.findOneAndUpdate({ product_id: data.id }, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })

    }
  }

  vendorActiveProduct = async (req, res) => {
    try {
      const { page, limit, status } = req.query;
      const matchProduct = {
        user_id: req.userId
      }
      if (status) {
        matchProduct['status'] = status
      }
      const populateFilter = [
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
        {
          path: "user_id"
        }
      ]
      // console.log(matchProduct);
      // console.log("status", status);
      // const filterProduct = [
      //   {
      //     $match: matchProduct
      //   },
      //   {
      //     $lookup: {
      //       from: 'products',
      //       localField: 'product_id',
      //       foreignField: '_id',
      //       as: 'product_id'
      //     },
      //   },
      //   { $unwind: '$product_id' },
      //   {
      //     $project: {
      //       // "product_id._id":1,
      //       "product_id.categories": 0,
      //       // "product_id.images":1,
      //       "product_id.productAttribute": 0,
      //     }
      //   }
      // ];
      let options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 2
      }
      const data = await this.vendorProductModel.find(matchProduct).populate(populateFilter)
      // const data = await this.aggregatePaginate(this.vendorProductModel, filterProduct, options)
      return res.status(200).json({ data: data, id: req.userId })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }

  productListView = async (req, res) => {
    try {
      const { page, limit } = req.query;
      let options = {
        page: page ? parseInt(page) : 1,
        limit: page ? parseInt(limit) : 10
      }
      const productFilter = [
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product_id'
          }
        },
        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          }
        },
        {
          $project:
          {
            "user_id.fcpassword": 0,
            "user_id.isStaff": 0,
            "user_id.isActive": 0,
            "user_id.isSuperuser": 0,
            "user_id.dateJoined": 0,
            "user_id.status": 0,
            "user_id.user_type": 0,
            "user_id.email_otp": 0,
            "user_id.mobile_otp": 0,
            "product_id.categories": 0,
            "product_id.familyAtrributeId": 0
          }
        }
      ]
      // const data = await this.productsModel.find();
      const data = await this.aggregatePaginate(this.vendorProductModel, productFilter, options);
      return res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
  // productDetails = async (req,res) =>{
  //   try {
  //     const _id = req.params.id;
  //     const productFilter =[
  //       {$match:{isActive:true,isDeleted:true,_id:this.mongoose.Types.ObjectId(_id)}},
  //       {
  //         $lookup: {
  //           from: 'categories',
  //           localField: 'categories.categorieId',
  //           foreignField: '_id',
  //           as: 'categories'
  //         }
  //       },
  //       {
  //         $lookup: {
  //           from: 'attribute_familys',
  //           localField: 'familyAtrributeId',
  //           foreignField: '_id',
  //           as: 'familyAtrributeId'
  //         }
  //       },
  //       {$project:{
  //         "categories":false,
  //         "familyAtrributeId":false
  //       }}
  //     ]
  //     // const data = await this.productsModel.find();
  //     const data = await this.aggregateFilter(this.productsModel,productFilter);
  //     return res.status(200).json({data})
  //   } catch (error) {
  //     return res.status(500).json({error})
  //   }
  // }


  vendorProduct = async (req, res) => {
    try {
      const _id = req.userId;
      const data = await this.vendorProductModel.find({ _id })
      res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  productByCategory = async (req, res) => {
    try {
      let id = req.params.id
      let result = await this.allListByCategory(this.vendorProductModel, id)
      return res.status(200).json({
        result: result
      })
    } catch (error) {
      res.status(500).json({
        error: error
      })
    }
  }


  vendorProductByVendorId = async (req, res) => {
    try {
      let id = req.params.id
      let result = await this.allList(this.vendorProductModel, id)
      res.status(200).json({
        result: result
      })
    } catch (error) {
      res.status(500).json({
        error: error
      })
    }
  }

  /*
     get all  product list by vendor id
  */

  /*
     GET  VENDORS METHOD 
  */
  getVendors = async (req, res) => {
    try {
      var price = req.query.price ? new RegExp(req.query.price) : ""

      // return res.send(price)
      // let filter = [
      //   // { $match: { 'price': { $regex:price} } },  
      //   // { $regexMatch: {  'price': { $regex: '/0/' } } }, 
      //   //  { $regexMatch: { input: "$price", regex: /0/ } } ,
      //   // { $regexMatch: { input: "$price", regex: price } },
      //   //  {$regex:{$price:{$regex: new RegExp(req.query.price)}}},
      //   //  {$regexFind: {input:"$price", regex: /500/}},

      //   {
      //     // {_id:ObjectId('619899ee788e1e02bf8a5e6a')}

      //     $lookup: {
      //       from: 'products',
      //       localField: 'product_id',
      //       foreignField: '_id',
      //       as: 'product_id'
      //     },

      //   },
      //   {
      //     $lookup: {
      //       from: 'auth_users',
      //       localField: 'user_id',
      //       foreignField: '_id',
      //       as: 'user_id'
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'attributes',
      //       localField: 'product_id.productAttribute.attributeId',
      //       foreignField: '_id',
      //       as: 'attributeId'
      //     }
      //   },


      //   // {
      //   //   $addFields: {
      //   //     "product_id.productAttribute.attributeId": {
      //   //       $map: {
      //   //         input: { $zip: { inputs: ["$attributeId", "$attributeId"] } },
      //   //         in: { $mergeObjects: "$$this._id" },
      //   //       },

      //   //     },

      //   //   },
      //   // },


      //   // {
      //   //   $project: {
      //   //     "product_id.productAttribute.attributeId": {
      //   //       "$arrayToObject": {
      //   //         $map: {
      //   //           input: "$attributeId",
      //   //           "in": {
      //   //             $mergeObjects: "$$this._id",
      //   //           }
      //   //         }
      //   //       }
      //   //     }
      //   //   }
      //   // }

      //   // {$match:{'product_id.productAttribute.attributeId.option._id':'61b6e1ccf59f23e4a9d4f4fc'}},


      //   // { $addFields: { resultObject: { $regexFind: { input: "$price", regex: /cafe/ }  } } }
      //   // { $city:  { $regexMatch: { input: "5000", price } }  },
      // ]

      var populateFilter = [
        // { $unwind : "$attributes" },
        // { $match: { "isDeleted": false, isActive: true } },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $lookup: {
            from: 'auth_users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'attributes',
            localField: 'product.productAttribute.attributeId',
            foreignField: '_id',
            as: 'product_productAttribute_attributeId'
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.categories.categorieId',
            foreignField: '_id',
            as: 'product_categories'
          }
        },
        {
          $lookup: {
            from: 'attribute_familys',
            localField: 'product.familyAtrributeId',
            foreignField: '_id',
            as: 'product_attribute_familys'
          }
        },

      ];
      const { page, limit } = req.query;
      if (!page && !limit) {
        var data = await this.vendorProductModel.aggregate(populateFilter);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.vendorProductModel, populateFilter, options)
        return res.status(200).json({ data: data })
      }

      //  let res = await   this.vendorProductModel.aggregate([
      //       { $addFields: { returnObject: { $regexFind: { input: "$description", regex: /tier/ } } } }
      //    ])
      //    res.send(res)

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }

  }


  //  /*
  //   GET ALL APPROVE STATUS
  //  
  approveVendorproducts = async (req, res) => {
    try {
      console.log(req);
      const data = await this.vendorProductModel.find()
      console.log(data);
      return res.status(200).json({ data })
      // let data = await this.approvelist(this.vendorProductModel)
      // return res.status(200).json({
      //   result: data
      // })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  //  /*
  //   GET ALL PENDING STATUS
  //  /*

  pendingVendorproducts = async (req, res) => {
    try {
      let data = await this.pendinglist(this.vendorProductModel)
      return res.status(200).json({
        result: data
      })
    } catch (error) {
      res.status(500).json({
        error: error
      })
    }
  }

  //   /* 
  //      GET   VENDOR DETAILS METHOD 
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
        const filter_data = [
          { $match: { _id: mongoose.Types.ObjectId(_id) } },
          {
            $lookup: {
              from: 'products',
              localField: 'product_id',
              foreignField: '_id',
              as: 'product_id'
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
              from: 'categories',
              localField: 'product_id.categories.categorieId',
              foreignField: '_id',
              as: 'categories'
            },
          },
        ]
        // const data = await this.findOne(this.vendorProductModel, _id);
        const data = await this.aggregateScheam(this.vendorProductModel, filter_data)
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

  AddVendorProduct = async (req, res) => {
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
        for (let i = 0; i < payload.product_images.length; i++) {
          payload.product_images[i].image = await base64toImage(payload.product_images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
        }
        console.log(payload.product_images);
        let option = {
          user_id: payload.user_id,
          product_id: payload.product_id,
          price: payload.price,
          description: payload.description,
          discount: payload.discount,
          product_images: payload.product_images,
          short_description: payload.short_description,
          inventory: payload.inventory,
        }
        console.log(option);
        let user = await this.add(this.vendorProductModel, option);
        return res.status(200).json({ result: user });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  //   /*
  //     UPDATE   VENDORS  DETAILS METHOD  OR Verify Vendor
  //  */

  updateVendorProduct = async (req, res) => {
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

        await this.updateOne(this.vendorProductModel, _id, payload);
        return res.status(200).json({ message: "update " });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  //   /*
  //     DELETE  VENDORS DETAILS METHOD 
  //  */

  deleteVendorProduct = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.vendorProductModel, id);
      // await this.deleteOne(this.authUserModel, id);
      return res.status(200).json({ message: "delete delete" })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  };

  // get all products for  vendor price range min to high---

  productPrice = async (req, res) => {
    try {

      let filter = [
        { $sort: { price: 1 } },
        { $match: { status: 'active' } },
        {
          // {_id:ObjectId('619899ee788e1e02bf8a5e6a')}
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product_id'
          },

        },
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
        var data = await this.vendorProductModel.aggregate(filter);
        return res.status(200).json({ data: data })
      }
      else {
        let options = {
          page: parseInt(page),
          limit: parseInt(limit)
        }
        var data = await this.aggregatePaginate(this.vendorProductModel, filter, options)
        return res.status(200).json({ data: data })
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

};

module.exports = VendorController