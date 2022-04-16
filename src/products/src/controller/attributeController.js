const express = require('express');
const MongooseService = require('../service/attributeService');
const { validationResult } = require('express-validator');
const { base64toImage } = require('../utls/base64toString');
const { HttpMethods } = require('../utls/error')
const {models} = require('../../../database/index')

class attributeController extends MongooseService {
  path = '/attribute';
  params = '/:id'
  jwtToken = require('../middleware/jwtTokenMiddleware')
  adminToken = require('../middleware/adminPermission')
  adminRouter = express.Router();
  validation = require('../utls/attributeValidations');
  attributeModel = models.attributeModel
  constructor() {
    super()
    this.HttpMethods = HttpMethods;
    this.intializeRoutes()
  }

  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.adminRouter.get(this.path,this.jwtToken,this.adminToken, this.getAttribute);
    this.adminRouter.post(this.path,this.jwtToken,this.adminToken, this.validation.attribute, this.addAttribute);
    this.adminRouter.put(this.path+this.params,this.jwtToken,this.adminToken,this.validation.attributeUpdate,this.validation.attribute_update,this.updateAttribute);
    this.adminRouter.delete(this.path+this.params,this.jwtToken,this.adminToken,this.validation.attributeUpdate,this.deleteAttribute);
    // this.adminRouter.get('/is-configurable',this.isConfigurableGet)
  }



  // isConfigurableGet = async (req,res) =>{
  //   try {
  //     const data = await this.attributeModel.find({isConfigurable:true,type:"select"});
  //     return res.status(200).json({data})
  //   } catch (error) {
  //     return res.status(500).json({error})
  //   }
  // }
  /*
     GET  CATEGORIES METHOD 
  */
  getAttribute = async (req, res) => {
    try {
      var querys = {isActive:true,isDeleted:false};
      const { page, limit } = req.query;
      console.log(page, limit);
      if (!page && !limit) {
          var data = await this.attributeModel.find(querys)
          console.log(data);
      }
      else {

        
          var options = {
              // select: 'title icon parentId',
          
              page: page ? parseInt(page) : 1,
              limit: limit ? parseInt(limit) : 1,
          };
            
        if(req.query.search) {
          let regex = new RegExp(`${req.query.search}`,)
          querys['name']= regex
        }
       
          var data = await this.listPaginate(this.attributeModel, querys, options);
      }
      return res.status(this.HttpMethods.Success.status).json({data:data});

    }
    catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })
    }
  }

  addAttribute = async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
          res.status(this.HttpMethods.UnprocessableEntity.status).json({
              message:errors.msg,
              errors:errors.errors
          })
      }
      else{
        let payload = req.body;
        var option = {
          name: payload.name,
          code: payload.code,
          type: payload.type,
          status: payload.status,
          required: payload.status,
        }
        if(payload.type == "multiselect"){
          
          if(!payload.option){
             return res.status(this.HttpMethods.UnprocessableEntity.status).json({error:"multiselect options required"})
          }
          else{
            option['option'] = payload.option;
          }
        }
        if(payload.type == "select"){
          
          if(!payload.option){
             return res.status(this.HttpMethods.UnprocessableEntity.status).json({error:"select options required"})
          }
          else{
            option['option'] = payload.option;
          }
        }
        console.log(option,">>>>>>>>>>>>>>>");
        await this.add(this.attributeModel,option).then(data=>{
          if(data){
            console.log(data,"---------------");
            res.status(this.HttpMethods.Success.status).json({message:"add attribute"})
          }
        })
      }
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })
    }
  }

  updateAttribute = async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
          res.status(this.HttpMethods.UnprocessableEntity.status).json({
              message:errors.msg,
              errors:errors.errors
          })
      }
      else{
        var _id = req.params.id;
        let payload = req.body;
        var option = {
          name: payload.name,
          code: payload.code,
          type: payload.type,
          status: payload.status,
          required: payload.status,
        }
        console.log(payload);
        // if(payload.type == "multiselect"){
          
        //   if(!payload.option){
        //      return res.status(this.HttpMethods.UnprocessableEntity.status).json({error:"multiselect options required"})
        //   }
        //   else{
        //     option['option'] = payload.option;
        //   }
        // }
        await this.updateOne(this.attributeModel,_id,payload).then(data=>{
          if(data){
            res.status(this.HttpMethods.Success.status).json({message:"update attribute"})
          }
        })
      }
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })
    }
  }

  deleteAttribute = async (req,res) =>{
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
          res.status(this.HttpMethods.UnprocessableEntity.status).json({
              message:errors.msg,
              errors:errors.errors
          })
      }
      else{
        var _id= req.params.id;
        await this.tempDelete(this.attributeModel,_id).then(data=>{
          if(data){
            res.status(this.HttpMethods.Success.status).json({message:"update attribute"})
          }
        })
      }
    } catch (error) {
      return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })
      
    }
  }

}
module.exports = attributeController