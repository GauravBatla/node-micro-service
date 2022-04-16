const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult } = require('express-validator');
const { base64toImage } = require('../utls/base64toString');
const moment = require('moment');
const { HttpMethods } = require('../utls/error');
// const { base } = require('../model/productsModel');
const mongoose = require('mongoose')
// const {base64toImage} = require('../utls/base64toString')
const {models} = require('../../../database/index')

class CategorieController extends MongooseService {
  path = '/products';
  params = '/:id';
  imagePath = "http://192.168.68.98:5001/"
  router = express.Router();
  uploadImagePath = "/productsupdate/:id"
  uploadImagePath1 = "/productsupdate/:id/:imageId"
  venderUploadImagePath1 = "/productsupdate/apk/:id/:imageId"
  adminRouter = express.Router();
  router = express.Router()
  validation = require('../utls/validations');
  mongoose = require('mongoose')
  productsModel = models.productsModel
  attributeFamilyModel = models.attributeFamilyModel
  attributeModel = models.attributeModel
  // vendorProductModel = require('../model/vendorProductModel')
  vendorProductModel = models.vendorProductModel;
  userModel = models.authUserModel
  jwtToken = require('../middleware/jwtTokenMiddleware')
  adminToken = require('../middleware/adminPermission')
  constructor() {
    super()
    this.pathGetCategoriesByProject = this.path + '/categories' + this.params;
    this.HttpMethods = HttpMethods
    this.intializeRoutes()
  }

  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.adminRouter.post(this.path, this.jwtToken, this.validation.productsStep1, this.addProduct);
    this.adminRouter.post('/vendor-product-add', this.jwtToken, this.validation.productsStep1, this.addVendorProduct);
    this.adminRouter.get(this.path, this.getProduct);
    this.adminRouter.get(this.path + this.params, this.jwtToken, this.adminToken, this.getProductDetails);
    this.adminRouter.get(this.pathGetCategoriesByProject, this.jwtToken, this.adminToken, this.getCategoriesByProject)
    // this.adminRouter.get(this.params,this.validation.validParam,this.categorieDetails);
    this.adminRouter.put(this.path + this.params, this.jwtToken, this.adminToken, this.validation.update, this.updateProduct)
    this.adminRouter.put(this.path + '/delete' + this.params, this.jwtToken, this.adminToken, this.jwtToken, this.adminToken, this.deleteProduct);
    this.adminRouter.put(this.uploadImagePath, this.validation.imageUpdate, this.jwtToken, this.adminToken, this.uploadImageProduct)
    this.adminRouter.put(this.uploadImagePath1, this.jwtToken, this.adminToken, this.updateImageProduct)
    this.adminRouter.delete(this.uploadImagePath + "/:imageId", this.jwtToken, this.adminToken, this.deleteImageProduct)
    this.adminRouter.delete(this.venderUploadImagePath1, this.jwtToken, this.updateImageProduct)
    this.adminRouter.post('/test-product', this.jwtToken, this.adminToken, this.validation.configurableProducts, this.testaddProduct);
    this.adminRouter.put('/addNewProductAttribute', this.jwtToken, this.adminToken, this.addNewProductAttribute);
    this.adminRouter.get('/vendorproduct/:id', this.vendorProductDetails)
    this.router.get('/vendor-product-list',this.getVendorProductList)
    this.router.get('/vendor-product-details/:id',this.test_vendor_product_details)
    // this.router.get('/product-list',this.productListView)
    // this.router.get('/product/:id',this.productDetails)
    // this.adminRouter.get('/is-configurable',this.isConfigurableGet)

  }


  /*
     GET  CATEGORIES METHOD
  */



     test_vendor_product_details = async (req,res) =>{
       try {
         const _id= req.params.id
        const populate_filter = [
          // {
          //   path: "product_id",
          //   populate: [{
          //     path: "categories.categorieId"
          //   }, {
          //     path: "familyAtrributeId",
          //     populate: {
          //       path: "family_attribute"
          //     }
          //   }, {
          //     path: "productAttribute.attributeId"
          //   }]
          // },
          // {

          //   path: "populate_filter.categories.categorieId",

          // },

          // {
          //   path: "categories.categorieId"
          // }, {
          //   path: "familyAtrributeId",
          //   populate: {
          //     path: "family_attribute"
          //   }
          // }, {
          //   path: "productAttribute.attributeId"
          // },
          {
            path: "familyAtrributeId",
            populate: {
              path: 'family_attribute'
            }
          },
          {
            path: "productAttribute",
            populate: {
              path: 'attributeId'
            }
          },
          {
            path:"categories",
            populate:[
              {
                path:"categorieId"
              }
            ]
          }
          // {
          //   path: "populate_filter.productAttribute.attributeId",

          // }
        ]
        const data =await this.productsModel.findById({_id}).populate(populate_filter)
        return res.status(200).json({data})
       } catch (error) {
         
         return res.status(500).json({error})
       }
     }

  

    getVendorProductList = async (req,res) =>{
      try {
        const {search,page,limit} = req.query;
        var categorie ={
          $lookup:{
            from:"categories",
            foreignField:"_id",
            localField:"categories.categorieId",
            as:"categories"
          }
        }
        const productList = []
        var  match = {
           $match:{  "productType": { "$ne": 'configurable' } }
        }
        productList.push(match)
        if(search){
          productList.push(
          {  $match:{
              product_name:new RegExp(search)
            }}
          )
        }
        productList.push(categorie)

      
        
        // const data = await this.productsModel.find(options)
        var data = await this.aggregatePaginate(this.productsModel,productList);
        const check_product_code = data.totalDocs ==0?true:false
        if(check_product_code){
          productList.push(match),
          productList.push(categorie)
          if(search){
            productList.push(
              {  $match:{
                product_code:new RegExp(search)
                }}
              )
          }
          var data = await this.aggregatePaginate(this.productsModel,productList);
          const check_categorie = data.totalDocs ==0?true:false;
          if(check_categorie){
            productList.push(match),
            productList.push(categorie)
            if(search){
              productList.push(
                {  $match:{
                  "categories.title":new RegExp(search)
                  }}
                )
            }
            var data = await this.aggregatePaginate(this.productsModel,productList);
          }
        }
    
        return res.status(200).json({data})
      } catch (error) {
        return res.status(500).json({error})
      }
    } 


     vendorProductDetails  = async (req, res) => {
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
        const data = await this.vendorProductModel.findOne({ _id: _id }).populate(populate_filter)
        // const  filter_data = [
        //   { $match: { _id: mongoose.Types.ObjectId(_id) } },
        //   {
        //       $lookup: {
        //           from: 'products',
        //           localField: 'product_id',
        //           foreignField: '_id',
        //           as: 'product_id'
        //       },

        //   },
        //   {
        //       $lookup: {
        //           from: 'auth_users',
        //           localField: 'user_id',
        //           foreignField: '_id',
        //           as: 'user_id'
        //   },
        //   },
        //   {
        //     $lookup: {
        //         from: 'categories',
        //         localField: 'product_id.categories.categorieId',
        //         foreignField: '_id',
        //         as: 'categories'
        // },
        // },
        // ]
        // const data = await this.findOne(this.vendorProductModel, _id);
        // const data = await this.aggregateFilter(this.vendorProductModel,filter_data)
        return res.status(200).json({ data: data });
      }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }


  addVendorProduct = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(this.HttpMethods.UnprocessableEntity.status).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        const check_admin = await this.userModel.findOne({isSuperuser:true,_id:req.userId});
        if (payload.productType == 'simple') {
          console.log(payload.productAttribute);
          if (payload.images) {
            for (let i = 0; i < payload.images.length; i++) {
              payload.images[i].image = await base64toImage(payload.images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
            }
          }
          console.log(payload.images[0].isPrimary);
          let options = {
            productType: payload.productType,
            familyAtrributeId: payload.familyAtrributeId,
            sku: payload.sku,
            // changes
            product_name: payload.product_name,
            product_code: payload.product_code,
            description: payload.description,
            short_description: payload.short_description,
            product_price: payload.product_price,
            product_code: payload.product_code,
            categories: payload.categories,
            inventory: payload.inventory | 0,
            meta_title: payload.meta_title,
            meta_tags: payload.meta_tags,
            meta_title: payload.meta_title,
            meta_description: payload.meta_description,
            productAttribute: payload.productAttribute,
            images: payload.images,
            product_created_by:check_admin? 'admin':'vendor'
          }
          // console.log(payload.images);
          console.log(options.images);
          var data = await this.add(this.productsModel, options);
          console.log(req.userId);
          let options2 = {
            user_id: req.userId,
            product_id: data._id,
            price: payload.product_price,
            product_images: payload.images,
            description: payload.description,
            short_description: payload.short_description,
            discount: req.body.discount || 0,
            inventory: payload.inventory | 0,
          }
          await this.add(this.vendorProductModel, options2)
          return res.status(this.HttpMethods.Success.status).json({ data: data })
        }
        else if (payload.productType == 'configurable') {
          for (let i = 0; i < payload.images.length; i++) {
            payload.images[i].image = await base64toImage(payload.images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
          }
          // const familyAtrribute = await this.attributeFamilyModel.find({ _id: payload.familyAtrributeId });
          // console.log(familyAtrribute, "familyAtrribute");
          // console.log(payload.images[0].isPrimary);
          let options = {
            productType: payload.productType,
            familyAtrributeId: payload.familyAtrributeId,
            sku: payload.sku,
            // changes
            product_name: payload.product_name,
            product_code: payload.product_code,
            description: payload.description,
            short_description: payload.short_description,
            product_price: payload.product_price,
            // product_code: payload.product_code,
            categories: payload.categories,
            inventory: payload.inventory | 0,
            meta_title: payload.meta_title,
            meta_tags: payload.meta_tags,
            meta_title: payload.meta_title,
            meta_description: payload.meta_description,
            productAttribute: payload.productAttribute,
            images: payload.images
          }
          console.log(options.images);
          const newData = new this.productsModel(options)
          await newData.save()
          var array1 = []
          var variantProduct = []
          var array2 = [];
          var array3 = [];
          var attribute_id = '';
          var attribute_id2 = '';
          var count = 0
          if (payload.variantProductAttribute.length > 1) {
            for (var i = 0; i < payload.variantProductAttribute.length; i++) {
              if (i == 0) {
                array1 = payload.variantProductAttribute[i].option;
                attribute_id = payload.variantProductAttribute[i].attributeId
              }
              if (i > 0) {
                console.log(payload.variants, "vt");
                array2 = payload.variantProductAttribute[i].option;
                console.log(array2, "arr2");
                attribute_id2 = payload.variantProductAttribute[i].attributeId
              }
              if (array2.length > 0) {
                array1.flatMap(async (data) => {
                  array2.map(async (item) => {
                    let type = typeof data;
                    if (type == 'object') {
                      var test = data;
                      test = [{
                        attributeId: attribute_id2,
                        attribute_value: item
                      }]
                      var test = [...data, ...test]
                      console.log(test);
                    }
                    else {
                      var test = [
                        {
                          attributeId: attribute_id,
                          attribute_value: data
                        },
                        {
                          attributeId: attribute_id2,
                          attribute_value: item
                        },
                      ]
                    }
                    if (test.length == payload.variantProductAttribute.length) {
                      console.log(test);
                      var option1 = options
                      option1["parentId"] = newData._id
                      option1['productAttribute'] = [...test, ...payload.productAttribute]
                      option1['sku'] = options.sku + "-" + count
                      option1['product_code'] = options.product_code + "-" + count
                      option1['product_price'] = 0
                      option1['productType'] = 'simple'
                      console.log(variantProduct, "??");
                      variantProduct.push(option1)
                   const data3=   await this.add(this.productsModel, option1)
                      let options2 = {
                        user_id: req.userId,
                        product_id: data3._id,
                        price: payload.product_price,
                        product_images: payload.images,
                        description: payload.description,
                        short_description: payload.short_description,
                        discount: req.body.discount || 0,
                        inventory: payload.inventory | 0,
                      }
                      await this.add(this.vendorProductModel, options2)
                      count++
                    }
                    array3.push(test)
                  })
                })
                array1 = array3
                console.log(array3.length, "L?");
              }
            }
          }
          else {
            for (var i = 0; i < payload.variantProductAttribute[0].option.length; i++) {
              console.log(count, "count");
              console.log(i, 'i');
              var test = [{ attributeId: payload.variantProductAttribute[0].attributeId, attribute_value: payload.variantProductAttribute[0].option[i] }]
              var option1 = options
              option1["parentId"] = newData._id
              // option1['productAttribute'] =
              option1['productAttribute'] = [...test, ...payload.productAttribute]
              option1['sku'] = options.sku + payload.variantProductAttribute[0].option[i]
              option1['product_code'] = options.product_code + payload.variantProductAttribute[0].option[i]
              option1['product_price'] = 0
              option1['productType'] = 'simple'
              console.log(variantProduct, "??");
              variantProduct.push(option1)
              count++;
            const data1=  await this.add(this.productsModel, option1)
              let options2 = {
                user_id: req.userId,
                product_id: data1._id,
                price: payload.product_price,
                product_images: payload.images,
                description: payload.description,
                short_description: payload.short_description,
                discount: req.body.discount || 0,
                inventory: payload.inventory | 0,
              }
              await this.add(this.vendorProductModel, options2)
            }
          }
          return res.status(this.HttpMethods.Success.status).json({ data: newData })
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }

  updateImageProduct = async (req, res) => {
    try {
      var _id = req.params.id;
      var imageId = req.params.imageId;
      const payload = req.body;
      let option = {
        // image:await base64toImage(payload.image, "upload/", moment().format('DDMMYYhhiiss') + i + "image"),
        image: payload.image,
        is_primary: payload.payload
      }
      await this.productsModel.updateOne({ _id: _id, "images._id": imageId }, { $set: { images: option } });
      res.status(200).json({ message: "update" })
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }


  uploadImageProduct = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(this.HttpMethods.UnprocessableEntity.status).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        var _id = req.params.id;
        const images = payload.images;
        if (!payload.images) {
          return res.status(422).json({ error: "required images array" })
        }

        for (var i = 0; i < images.length; i++) {
          payload['image'] = await base64toImage(images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
          payload['is_primary'] = images[i].is_primary
        }
        await this.productsModel.updateOne({ _id: _id }, { "$push": { "images": images } }, { new: true })
        res.status(200).json({ option: "update images" })

      }
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }


  deleteImageProduct = async (req, res) => {
    try {
      var _id = req.params.id;
      var imageId = req.params.imageId;
      await this.productsModel.updateOne({ _id: _id }, { $pull: { "images": { _id: imageId } } });
      return res.status(200).json({ message: "delete image" })
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }

  addProduct = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(this.HttpMethods.UnprocessableEntity.status).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        // const check_admin = await this.productsModel.findOne({})
        if (payload.productType == 'simple') {
          console.log(payload.productAttribute);
          for (let i = 0; i < payload.images.length; i++) {
            payload.images[i].image = await base64toImage(payload.images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
          }

          console.log(payload.images[0].isPrimary);
          let options = {
            productType: payload.productType,
            familyAtrributeId: payload.familyAtrributeId,
            sku: payload.sku,
            // changes
            product_name: payload.product_name,
            product_code: payload.product_code,
            description: payload.description,
            short_description: payload.short_description,
            product_price: payload.product_price,
            product_code: payload.product_code,
            categories: payload.categories,
            inventory: payload.inventory | 0,
            meta_title: payload.meta_title,
            meta_tags: payload.meta_tags,
            meta_title: payload.meta_title,
            meta_description: payload.meta_description,
            productAttribute: payload.productAttribute,
            images: payload.images
          }
          // console.log(payload.images);
          console.log(options.images);
          var data = await this.add(this.productsModel, options)
          console.log(data);
          return res.status(this.HttpMethods.Success.status).json({ data: data })
        }
        else if (payload.productType == 'configurable') {
          for (let i = 0; i < payload.images.length; i++) {
            payload.images[i].image = await base64toImage(payload.images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
          }
          // const familyAtrribute = await this.attributeFamilyModel.find({ _id: payload.familyAtrributeId });
          // console.log(familyAtrribute, "familyAtrribute");
          // console.log(payload.images[0].isPrimary);

          let options = {
            productType: payload.productType,
            familyAtrributeId: payload.familyAtrributeId,
            sku: payload.sku,
            // changes
            product_name: payload.product_name,
            product_code: payload.product_code,
            description: payload.description,
            short_description: payload.short_description,
            product_price: payload.product_price,
            // product_code: payload.product_code,
            categories: payload.categories,
            inventory: payload.inventory | 0,
            meta_title: payload.meta_title,
            meta_tags: payload.meta_tags,
            meta_title: payload.meta_title,
            meta_description: payload.meta_description,
            productAttribute: payload.productAttribute,
            images: payload.images
          }
          console.log(options.images);
          const newData = new this.productsModel(options)
          await newData.save()
          var array1 = []
          var variantProduct = []
          var array2 = [];
          var array3 = [];
          var attribute_id = '';
          var attribute_id2 = '';
          var count = 0
          if (payload.variantProductAttribute.length > 1) {
            for (var i = 0; i < payload.variantProductAttribute.length; i++) {
              if (i == 0) {
                array1 = payload.variantProductAttribute[i].option;
                attribute_id = payload.variantProductAttribute[i].attributeId
              }
              if (i > 0) {
                console.log(payload.variants, "vt");
                array2 = payload.variantProductAttribute[i].option;
                console.log(array2, "arr2");
                attribute_id2 = payload.variantProductAttribute[i].attributeId

              }
              if (array2.length > 0) {

                array1.flatMap(async (data) => {
                  array2.map(async (item) => {
                    let type = typeof data;

                    if (type == 'object') {
                      var test = data;

                      test = [{
                        attributeId: attribute_id2,
                        attribute_value: item
                      }]

                      var test = [...data, ...test]
                      console.log(test);

                    }
                    else {
                      var test = [
                        {
                          attributeId: attribute_id,
                          attribute_value: data
                        },
                        {
                          attributeId: attribute_id2,
                          attribute_value: item
                        },
                      ]
                    }
                    if (test.length == payload.variantProductAttribute.length) {
                      console.log(test);
                      var option1 = options
                      option1["parentId"] = newData._id
                      if(payload.productAttribute){
                        option1['productAttribute'] = [...test, ...payload.productAttribute]
                      }
                      else{
                        option1['productAttribute'] = [...test,]
                      }
                      option1['sku'] = options.sku + "-" + count
                      option1['product_code'] = options.product_code + "-" + count
                      option1['product_price'] = 0
                      option1['productType'] = 'simple'
                      console.log(variantProduct, "??");
                      variantProduct.push(option1)
                      await this.add(this.productsModel, option1)

                      count++
                    }

                    array3.push(test)

                  })
                })

                array1 = array3
                console.log(array3.length, "L?");

              }


            }
          }
          else {

            for (var i = 0; i < payload.variantProductAttribute[0].option.length; i++) {
              console.log(count, "count");
              console.log(i, 'i');
              var test = [{ attributeId: payload.variantProductAttribute[0].attributeId, attribute_value: payload.variantProductAttribute[0].option[i] }]
              var option1 = options
              option1["parentId"] = newData._id
              // option1['productAttribute'] = 
              option1['productAttribute'] = [...test, ...payload.productAttribute]
              option1['sku'] = options.sku + payload.variantProductAttribute[0].option[i]
              option1['product_code'] = options.product_code + payload.variantProductAttribute[0].option[i]
              option1['product_price'] = 0
              option1['productType'] = 'simple'
              console.log(variantProduct, "??");
              variantProduct.push(option1)
              count++;
              await this.add(this.productsModel, option1)

            }


          }
          return res.status(this.HttpMethods.Success.status).json({ data: newData })
        }

      }
    } catch (error) {
      console.log(error);
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }


  updateProduct = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(this.HttpMethods.UnprocessableEntity.status).json({
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
            await this.productsModel.findOneAndUpdate({ _id }, { $push: { images: updateImages } })
          }
          await this.productsModel.findOneAndUpdate({ _id }, payload);
          return res.status(200).json({ data: "update product" })
        }
        // console.log(baseImage);
        // payload['images'] = baseImage
        var data = await this.productsModel.updateOne({ _id: _id }, payload)

        return res.status(200).json({ data: data })
      }
    } catch (error) {
      console.log(error);
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })

    }
  }




  // getProduct = async (req, res) => {
  //   try {
  //     var querys = { "isDeleted": false, isActive: true }
  //     const limit = req.query.limit;
  //     const page = req.query.page;
  //     const parentId = req.query.parentId;
  //     if (parentId) {
  //       querys["parentId"] = this.mongoose.Types.ObjectId(parentId)
  //     }
  //     console.log(page);

  //     var populateFilter = [
  //       // { $unwind : "$attributes" },
  //       { $match: querys },
  //       // {
  //       //   $lookup: {
  //       //     from: 'attributes',
  //       //     localField: 'productAttribute.attributeId',
  //       //     foreignField: '_id',
  //       //     as: 'productAttribute_attributeId'
  //       //   }
  //       // },
  //       // {
  //       //   $addFields: {
  //       //     "productAttribute.attributeId": {
  //       //       $map: {
  //       //         input: { $zip: { inputs: ["$productAttribute_attributeId"] } },
  //       //         in: { $mergeObjects: "$$this" },
  //       //       },
  //       //     },
  //       //   },
  //       // },
  //       // {"$unwind":"$productAttribute"},
  //       {
  //         $lookup: {
  //           from: 'attributes',
  //           localField: 'productAttribute.attributeId',
  //           foreignField: '_id',
  //           as: 'productAttribute.attributeId'
  //         }
  //       },
  //       // {"$addFields":{"productAttribute.attribute_value":{"$arrayElemAt":["$productAttribute.attribute_value",12]}}},
  //       {
  //         $addFields: {
  //           productAttribute: {
  //             $map: {
  //               input: { $zip: { inputs: ["$productAttribute", "$attributeId"] } },
  //               in: { $mergeObjects: "$$this" },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'categories',
  //           localField: 'categories.categorieId',
  //           foreignField: '_id',
  //           as: 'categories.categorieId'
  //         }

  //       },
  //       // {
  //       //   $addFields: {
  //       //     categories: {
  //       //       $map: {
  //       //         input: { $zip: { inputs: ["$categories", "$categorieId"] } },
  //       //         in: { $mergeObjects: "$$this" },

  //       //       },

  //       //     },

  //       //   },

  //       // },
  //       {
  //         $lookup: {
  //           from: 'attribute_familys',
  //           localField: 'familyAtrributeId',
  //           foreignField: '_id',
  //           as: 'familyAtrributeId'
  //         }

  //       },
  //       // {
  //       //   $addFields: {
  //       //     familyAtrributeId: {
  //       //       $map: {
  //       //         input: { $zip: { inputs: ["$familyAtrributeIds"] } },
  //       //         in: { $mergeObjects: "$$this" },
  //       //       },
  //       //     },
  //       //   },
  //       // },
  //       {
  //         $lookup: {
  //           from: 'attributes',
  //           localField: 'familyAtrributeId.family_attribute',
  //           foreignField: '_id',
  //           as: 'familyAtrributeId_family_attribute'
  //         }


  //       },
  //       {
  //         $addFields: {
  //           "familyAtrributeId.family_attribute": {
  //             $map: {
  //               input: { $zip: { inputs: ["$familyAtrributeId_family_attribute"] } },
  //               in: { $mergeObjects: "$$this" },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $project: {

  //           "isDeleted": 0,
  //           "__v":0,

  //           "categories.categorieId.isDeleted":0,
  //           "categories.categorieId.isActive":0,
  //           "categories.categorieId.__v":0,
  //           "familyAtrributeId.family_attribute.isDeleted":0,
  //           "familyAtrributeId.family_attribute.isActive":0,
  //           "familyAtrributeId.family_attribute.__v":0,
  //           "productAttribute.attributeId.isDeleted":0,
  //           "productAttribute.attributeId.isActive":0,
  //           "productAttribute.attributeId.__v":0,
  //           "attributeId":0


  //         }
  //       }
  //     ];
  //     const options = {
  //       page: parseInt(page),
  //       limit: parseInt(limit),
  //     };
  //     if (!limit && !page) {
  //       var data = await this.aggregateFilter(this.productsModel, populateFilter);
  //     }
  //     else {
  //       var data = await this.aggregatePaginate(this.productsModel, populateFilter, options);
  //     }
  //     res.status(this.HttpMethods.Success.status).json({ data })
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
  //   }
  // }

  getProduct = async (req, res) => {
    try {
      var querys = { "isDeleted": false, isActive: true }
      const parentId = req.query.parentId;
      const product_name = req.query.product_name;
      if (parentId) {
        querys["parentId"] = this.mongoose.Types.ObjectId(parentId)
      }
      if (product_name) {
        querys["product_name"] = new RegExp(product_name)
      }
      const populate_filter = [
        {
          path: "categories.categorieId",

        },
        {
          path: "familyAtrributeId",
          populate: {
            path: 'family_attribute'
          }
        },
        {
          path: "productAttribute.attributeId",

        }
      ]
      const data = await this.productsModel.find(querys).populate(populate_filter);
      res.status(200).json({ data })
    }
    catch (error) {
      console.log(error);
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }



  addNewProductAttribute = async (req, res) => {
    try {
      const payload = req.body;
      var productId = req.query.parentId;
      var attributeIdTemp = [];
      var attribute_valueTemp = []
      payload.temp.forEach(item => {
        attributeIdTemp.push(item.attributeId);
        attribute_valueTemp.push(item.attribute_value)
      })


      var product_exist = false;
      // var productId = "61e2c128a0388572068afd82";
      var arryproduct = [];
      for (var i = 0; i < payload.temp.length; i++) {
        var temparry = []
        var filter = { parentId: productId, "productAttribute": { $elemMatch: payload.temp[i] } }
        if (i > 0) {
          filter['_id'] = { $in: arryproduct }
        }
        const check_product = await this.productsModel.find(filter).select('_id');

        for (var j = 0; j < check_product.length; j++) {
          temparry.push(check_product[j]._id)

        }
        arryproduct = temparry

        if (payload.temp.length - 1 == i) {
          if (check_product.length > 0) {
            product_exist = true;
            i = payload.temp.length;


          }

        }


      }


      if (product_exist) {
        return res.status(400).json({ message: "This product is already exist" })
      }
      else {
        // const payload = req.body;
        // console.log(payload.productAttribute);
        // for (let i = 0; i < payload.images.length; i++) {
        //   payload.images[i].image = await base64toImage(payload.images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
        // }
        const product_find = await this.productsModel.findOne({ _id: productId })

        //   product_name: {
        //     type: String,

        // },
        // product_code: {
        //     type: String,

        // },
        var options = {};
        // var options = product_find;
        // delete options._id
        options['parentId'] = productId;
        options['product_name'] = product_find.product_name
        options['product_code'] = product_find.product_name + Date.now()
        options['sku'] = product_find.product_name + Date.now()
        options['familyAtrributeId'] = product_find.familyAtrributeId;
        // options['productAttribute'] = [...product_find.productAttribute, ...payload.temp]
        options['productAttribute'] = [...payload.temp, ...product_find.productAttribute]
        options['inventory'] = 0
        options['productType'] = 'simple'
        console.log(options);
        const newData = new this.productsModel(options);
        newData.save()
        // var data = await this.add(this.productsModel, options)
        return res.status(200).json({ message: "Product Created" })



      }
      // res.status(200).json({ check_product:"hh", arryproduct })
      console.log(arryproduct, "??");
      // payload.temp.forEach(async(item, id) => {

      // })
      return res.status(200).json({ check_product: "hh", product_exist })


      // if(!check_product) return res.status(400).json({message:"erroe",attribute_valueTemp,attributeIdTemp})
      res.status(200).json({ check_product: "hh", attrib: "ute_valueTemp " })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }


  getProductDetails = async (req, res) => {
    try {
      var _id = req.params.id;
      var populateFilter = [
        // { $unwind : "$attributes" },
        { $match: { "isDeleted": false, isActive: true, "_id": this.mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: 'attributes',
            localField: 'productAttribute.attributeId',
            foreignField: '_id',
            as: 'attributeId'
          }
        },

        {
          $addFields: {
            productAttribute: {
              $map: {
                input: { $zip: { inputs: ["$productAttribute", "$attributeId"] } },
                in: { $mergeObjects: "$$this" },
              },
            },
          },
        },

        {
          $lookup: {
            from: 'categories',
            localField: 'categories.categorieId',
            foreignField: '_id',
            as: 'categorieId'
          }

        },
        {
          $addFields: {
            categories: {
              $map: {
                input: { $zip: { inputs: ["$categories", "$categorieId"] } },
                in: { $mergeObjects: "$$this" },

              },

            },

          },

        },
        {
          $lookup: {
            from: 'attribute_familys',
            localField: 'familyAtrributeId',
            foreignField: '_id',
            as: 'familyAtrributeIds'
          }

        },
        {
          $addFields: {
            familyAtrributeId: {
              $map: {
                input: { $zip: { inputs: ["$familyAtrributeIds"] } },
                in: { $mergeObjects: "$$this" },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'attributes',
            localField: 'familyAtrributeId.group.family_attribute.attribute_id',
            foreignField: '_id',
            as: 'test'
          }


        },
        {
          $addFields: {
            "familyAtrributeId.group.family_attribute.attribute_id": {
              $map: {
                input: { $zip: { inputs: ["$test"] } },
                in: { $mergeObjects: "$$this" },
              },
            },
          },
        },
        {
          $project: {

            "_id": true,
            "parentId": true,
            "productType": true,
            "categories": true,
            "familyAtrributeId": true,
            "sku": true,
            "productAttribute": true,
            "images": true,
            "inventory": true,
            "isActive": true,
            "relatedProducts": true

          }
        }
      ];
      // var 
      const options = {
        page: 1,
        limit: 1,
      };



      // var myAggregate = this.productsModel.aggregate(populateFilter);
      // this.productsModel
      //   .aggregatePaginate(myAggregate, options)
      //   .then(function (results) {
      //     console.log(results);
      //    return res.status(200).json({results})
      //   })
      //   .catch(function (err) {
      //    // console.log(err);
      //    return res.status(500).json({error:error})
      //   });

      //  var data= await this.aggregatePaginate(this.productsModel,populateFilter,options);
      var data = await this.aggregateFilter(this.productsModel, populateFilter);
      res.status(this.HttpMethods.Success.status).json({ data })
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }

  deleteProduct = async (req, res) => {
    try {
      var _id = req.params.id;
      var data = await this.productsModel.updateOne({ _id: _id }, { isDeleted: true })
      return res.status(200).json({ data: data })
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })

    }
  }

  getCategoriesByProject = async (req, res) => {
    var { categorieId } = req.params;
    var newCategoriesId = this.getObjectId(categorieId);

    try {
      var populateFilter = [
        // { $unwind : "$attributes" },
        // {$match:{"isDeleted":false,isActive:true}},
        {
          $match: {
            $and: [
              { categories: { $eq: newCategoriesId } }
            ]
          }
        },
        {
          $lookup: {
            from: 'attributes',
            localField: 'productAttribute.attributeId',
            foreignField: '_id',
            as: 'attributeId'
          }
        },

        {
          $addFields: {
            productAttribute: {
              $map: {
                input: { $zip: { inputs: ["$productAttribute", "$attributeId"] } },
                in: { $mergeObjects: "$$this" },
              },
            },
          },
        },

        {
          $lookup: {
            from: 'categories',
            localField: 'categories.categorieId',
            foreignField: '_id',
            as: 'categorieId'
          }

        },
        {
          $addFields: {
            categories: {
              $map: {
                input: { $zip: { inputs: ["$categories", "$categorieId"] } },
                in: { $mergeObjects: "$$this" },

              },

            },

          },

        },
        {
          $lookup: {
            from: 'attribute_familys',
            localField: 'familyAtrributeId',
            foreignField: '_id',
            as: 'familyAtrributeIds'
          }

        },
        {
          $addFields: {
            familyAtrributeId: {
              $map: {
                input: { $zip: { inputs: ["$familyAtrributeIds"] } },
                in: { $mergeObjects: "$$this" },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'attributes',
            localField: 'familyAtrributeId.group.family_attribute.attribute_id',
            foreignField: '_id',
            as: 'test'
          }


        },
        {
          $addFields: {
            "familyAtrributeId.group.family_attribute.attribute_id": {
              $map: {
                input: { $zip: { inputs: ["$test"] } },
                in: { $mergeObjects: "$$this" },
              },
            },
          },
        },
        {
          $project: {

            "_id": true,
            "parentId": true,
            "productType": true,
            "categories": true,
            "familyAtrributeId": true,
            "sku": true,
            "productAttribute": true,
            "images": true,
            "inventory": true,
            "isActive": true,
            "relatedProducts": true

          }
        }
      ];
      // var 
      const options = {
        page: 1,
        limit: 1,
      };

      // var myAggregate = this.productsModel.aggregate(populateFilter);
      // this.productsModel
      //   .aggregatePaginate(myAggregate, options)
      //   .then(function (results) {
      //     console.log(results);
      //    return res.status(200).json({results})
      //   })
      //   .catch(function (err) {
      //    // console.log(err);
      //    return res.status(500).json({error:error})
      //   });

      var data = await this.aggregatePaginate(this.productsModel, populateFilter, options);
      //  var data= await this.aggregateFilter(this.productsModel,populateFilter);
      res.status(this.HttpMethods.Success.status).json({ data })
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }

  }

  testaddProduct = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(this.HttpMethods.UnprocessableEntity.status).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;

        console.log(payload.productAttribute);
        for (let i = 0; i < payload.images.length; i++) {
          payload.images[i].image = await base64toImage(payload.images[i].image, "upload/", moment().format('DDMMYYhhiiss') + i + "image")
        }
        // const familyAtrribute = await this.attributeFamilyModel.find({ _id: payload.familyAtrributeId });
        // console.log(familyAtrribute, "familyAtrribute");
        // console.log(payload.images[0].isPrimary);

        let options = {
          productType: payload.productType,
          familyAtrributeId: payload.familyAtrributeId,
          sku: payload.sku,
          // changes
          product_name: payload.product_name,
          product_code: payload.product_code,
          description: payload.description,
          short_description: payload.short_description,
          product_price: payload.product_price,
          // product_code: payload.product_code,
          categories: payload.categories,
          inventory: payload.inventory | 0,
          meta_title: payload.meta_title,
          meta_tags: payload.meta_tags,
          meta_title: payload.meta_title,
          meta_description: payload.meta_description,
          productAttribute: payload.productAttribute,
          images: payload.images
        }
        console.log(options.images);
        const newData = new this.productsModel(options)
        await newData.save()
        var array1 = []
        var variantProduct = []
        var array2 = [];
        var array3 = [];
        var attribute_id = '';
        var attribute_id2 = '';
        var count = 0
        if (payload.variantProductAttribute.length > 1) {
          for (var i = 0; i < payload.variantProductAttribute.length; i++) {
            if (i == 0) {
              array1 = payload.variantProductAttribute[i].option;
              attribute_id = payload.variantProductAttribute[i].attributeId
            }
            if (i > 0) {
              console.log(payload.variants, "vt");
              array2 = payload.variantProductAttribute[i].option;
              console.log(array2, "arr2");
              attribute_id2 = payload.variantProductAttribute[i].attributeId

            }
            if (array2.length > 0) {

              array1.flatMap(async (data) => {
                array2.map(async (item) => {
                  let type = typeof data;

                  if (type == 'object') {
                    var test = data;

                    test = [{
                      attributeId: attribute_id2,
                      attribute_value: item
                    }]

                    var test = [...data, ...test]
                    console.log(test);

                  }
                  else {
                    var test = [
                      {
                        attributeId: attribute_id,
                        attribute_value: data
                      },
                      {
                        attributeId: attribute_id2,
                        attribute_value: item
                      },
                    ]
                  }
                  if (test.length == payload.variantProductAttribute.length) {
                    console.log(test);
                    var option1 = options
                    option1["parentId"] = newData._id
                    option1['productAttribute'] = [...test, ...payload.productAttribute]
                    option1['sku'] = options.sku + "-" + count
                    option1['product_code'] = options.product_code + "-" + count
                    option1['product_price'] = 0
                    option1['productType'] = 'simple'
                    console.log(variantProduct, "??");
                    variantProduct.push(option1)
                    await this.add(this.productsModel, option1)

                    count++
                  }

                  array3.push(test)

                })
              })

              array1 = array3
              console.log(array3.length, "L?");

            }


          }
        }
        else {

          for (var i = 0; i < payload.variantProductAttribute[0].option.length; i++) {
            console.log(count, "count");
            console.log(i, 'i');
            var test = [{ attributeId: payload.variantProductAttribute[0].attributeId, attribute_value: payload.variantProductAttribute[0].option[i] }]
            var option1 = options
            option1["parentId"] = newData._id
            // option1['productAttribute'] = 
            option1['productAttribute'] = [...test, ...payload.productAttribute]
            option1['sku'] = options.sku + payload.variantProductAttribute[0].option[i]
            option1['product_code'] = options.product_code + payload.variantProductAttribute[0].option[i]
            option1['product_price'] = 0
            option1['productType'] = 'simple'
            console.log(variantProduct, "??");
            variantProduct.push(option1)
            count++;
            await this.add(this.productsModel, option1)

          }


        }




        return res.status(this.HttpMethods.Success.status).json({ data: newData })
      }
    } catch (error) {
      console.log(error);
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
    }
  }

}
module.exports = CategorieController


