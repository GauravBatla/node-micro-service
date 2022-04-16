const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult } = require('express-validator');
const { base64toImage } = require('../utls/base64toString');
const moment = require('moment');
// const { test, hh } = require('../utls/test')
const {models} = require('../../../database/index')
const mongoose = require('mongoose')
class CategorieController extends MongooseService {
  path = '/categorie';
  params = '/:id';

  imagePath = "http://192.168.68.98:5001/"
  adminRouter = express.Router();
  router = express.Router();
  validation = require('../utls/categoriValidations');
  categorieModel = models.categorieModel
  jwtToken = require('../middleware/jwtTokenMiddleware')
  adminToken = require('../middleware/adminPermission')
  constructor() {
    super()
    this.subcategoriesPath = "/subcategories"
    this.testPath = "/test"
    this.intializeRoutes()
  }

  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    this.adminRouter.post(this.path,this.jwtToken,this.adminToken, this.validation.categorie, this.addCategorie);
    this.adminRouter.get(this.path, this.jwtToken,this.getCategories);
    // for vendor apk
    
    
    this.adminRouter.get("/categorie-apk",this.getCategories);
    this.adminRouter.get(this.subcategoriesPath, this.jwtToken,this.getSubCategories);
    this.adminRouter.get(this.testPath,this.jwtToken, this.democategories);
    this.adminRouter.get(this.params,this.jwtToken, this.validation.validParam, this.categorieDetails);
    this.adminRouter.put(this.path+this.params,this.jwtToken,this.adminToken ,this.validation.validParam, this.validation.categorieUpdate, this.updateCategorie)
    this.adminRouter.delete(this.path+this.params, this.jwtToken,this.deleteCategorie);

    this.router.get('/root-categories',this.getRootCategorie)

    this.router.get('/categories',this.getRootCategorie)
    this.router.get('/sub-categorie/:id',this.SubCategorie)
  }

  /*
     GET  CATEGORIES METHOD 
  */
 getRootCategorie = async (req,res) =>{
   try {
    // const { page, limit } = req.query;
  
    // var querys = { isDeleted: false, isActive: true };
    const data  = await this.categorieModel.find({'parentId': { $exists: true, $not: { '$size': 1 }}}).select('title icon')
    console.log(data);
    return res.status(200).json({data})
   } catch (error) {
     console.log(error);
     return res.status(500).json({error})
   }
 }
 SubCategorie = async (req,res) =>{
  try {
   // const { page, limit } = req.query;
    const _id = req.params;
   // var querys = { isDeleted: false, isActive: true };
   var demo = [
    {
      path: "parentId",
      populate: {
        path: "parentId",
        populate: {
          path: "parentId",
          populate: {
            path: "parentId",
            populate: {
              path: "parentId",
              populate: {
                path: "parentId",
                populate: {
                  path: "parentId"
                }
              }
            }
          }
        }
      }
    }
  ];
   const data  = await this.categorieModel.find({'parentId': {$in:[mongoose.Types.ObjectId(_id)]}}).populate(demo).select('title icon -parentId')
   console.log(data);
   return res.status(200).json({data})
  } catch (error) {
    console.log(error);
    return res.status(500).json({error})
  }
}

  getCategories = async (req, res) => {
    try {
     
      var querys = { isDeleted: false };
      var subquerys = { isDeleted: false };
      var select = "title icon isActive parentId"
      // var select = ""
      var populate = "parentId";
      var demo = [
        {
          path: "parentId",
          populate: {
            path: "parentId",
            populate: {
              path: "parentId",
              populate: {
                path: "parentId",
                populate: {
                  path: "parentId",
                  populate: {
                    path: "parentId",
                    populate: {
                      path: "parentId"
                    }
                  }
                }
              }
            }
          }
        }
      ];
      const { page, limit } = req.query;
      // if(req.query.subcategories) await req.query.subcategories === "true"?  querys["parentId"] = {$ne:null} : querys["parentId"] = {$eq:null}
      // req.query.subcategories == true?  populate = "parentId":populate;
      // req.query.subcategories == true? querys= {isDeleted:false,parentId:{$in:null}}:populate;
      // req.query.name?querys['name'] = {$regex:new RegExp(req.query.name)} : querys;
      // req.query.subcategories == true? querys = {isDeleted:false,"parentId":{$ne:null}}:querys
      if (!page && !limit) {
        // req.query.subcategories == true?  populate = "parentId":populate;
        console.log(querys);
        var data = await this.categorieModel.find(querys).populate(demo).select(select)
        // for(var i =0; i<data.length;i++){

        // }


      }
      else {
        var options = {
          populate: [
            {
              path: "parentId",
              populate: {
                path: "parentId",
                populate: {
                  path: "parentId",
                  populate: {
                    path: "parentId",
                    populate: {
                      path: "parentId",
                      populate: {
                        path: "parentId",
                        populate: {
                          path: "parentId"
                        }
                      }
                    }
                  }
                }
              }
            }
          ],
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 1,
        };
        options['select'] = select

        if (req.query.search) {
          let regex = new RegExp(`${req.query.search}`)
          querys['title'] = regex
        }

        //  {name:$regex:{}}


        // req.query.subcategories? options['populate'] = "parentId":populate
        var data = await this.listPaginate(this.categorieModel, querys, options);
      }

      return res.status(200).json({ data: data })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  getSubCategories = async (req, res) => {
    try {
      const { page, limit } = req.query;
      var querys = { isDeleted: false, isActive: true };
      var select = "title icon isActive parentId"
      // var select = ""
      var populate = "parentId";
      var demo = [
        {
          path: "parentId",
          populate: {
            path: "parentId",
            populate: {
              path: "parentId",
              populate: {
                path: "parentId",
                populate: {
                  path: "parentId",
                  populate: {
                    path: "parentId",
                    populate: {
                      path: "parentId"
                    }
                  }
                }
              }
            }
          }
        }
      ];

      //  if(req.query.subcategories) await req.query.subcategories === "true"?  querys["parentId"] = {$ne:null} : querys["parentId"] = {$eq:null}
      // req.query.subcategories == true?  populate = "parentId":populate;
      // req.query.subcategories == true? querys= {isDeleted:false,parentId:{$in:null}}:populate;
      // req.query.name?querys['name'] = {$regex:new RegExp(req.query.name)} : querys;
      // req.query.subcategories == true? querys = {isDeleted:false,"parentId":{$ne:null}}:querys
      if (!page && !limit) {
        // req.query.subcategories == true?  populate = "parentId":populate;

        var data = await this.categorieModel.find(querys).populate(demo).select(select).where("parentId").ne(null)
        // for(var i =0; i<data.length;i++){

        // }


      }
      else {
        var options = {
          populate: [
            {
              path: "parentId",
              populate: {
                path: "parentId",
                populate: {
                  path: "parentId",
                  populate: {
                    path: "parentId",
                    populate: {
                      path: "parentId",
                      populate: {
                        path: "parentId",
                        populate: {
                          path: "parentId"
                        }
                      }
                    }
                  }
                }
              }
            }
          ],

          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 1,

        };
        options['select'] = select

        if (req.query.search) {
          let regex = new RegExp(`${req.query.search}`,)
          querys['title'] = regex
        }

        //  {name:$regex:{}}


        // req.query.subcategories? options['populate'] = "parentId":populate
        var data = await this.listPaginate(this.categorieModel, querys, options);
      }

      return res.status(200).json({ data: data })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }


  democategories = async (req, res) => {
    try {

      const data = await this.categorieModel.find({ parentId: null })
      var categoryArray = [];
      for (let i = 0; i < data.length; i++) {
        // data[i]['subcategory'] = this.getSubCategory(data[i]._id)
        // var test1 = await this.hh(data[i]._id)
        // console.log(test1);
        // this.demo_function(data[i]._id)
        const temp = await this.getSubCategory(data[i]._id)
        console.log(temp, ".............");
        categoryArray.push({ '_id': data[i]._id, 'title': data[i].title, 'subcategory': temp })
      }
      //  const data = await this.aggregateFilter(this.categorieModel,populateFilter);
      return res.status(200).json({ data: categoryArray })
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }



  getSubCategory = (parentId) => {
    // try {

    // console.log("yes",parentId);
    // return "test"

    // return res.status(200).json({data:"test"})
    return new Promise((resolve, reject) => {
      this.categorieModel.find({ parentId: parentId }, (err, res) => {
        if (err) {
          reject(err)
        }
        var categoryArray = [];
        for (let i = 0; i < res.length; i++) {
          //     // data[i]['subcategory'] = this.getSubCategory(data[i]._id)
          //     // var test = await this.test(data[i]._id)
          //     // console.log(test);
          //     // this.getSubCategory(res[i]._id,(err,result)=>{
          //     //    console.log(result,">>>>>>>>>");
          //     //   categoryArray.push({'_id' : res[i]._id, 'title' : res[i].title, 'subcategory' : result})
          //     // })
          //     // console.log( temp,".............");
        }

        resolve(categoryArray)
      })

    })
    //   var categoryArray = [];
    //   for(let i = 0; i < data.length; i++){
    //       data[i]['subcategory'] = this.getSubCategory(data[i]._id)
    //       categoryArray.push({'_id' : data[i]._id, 'title' : data[i].title})
    //   }
    //   return data;
    //   //  const data = await this.aggregateFilter(this.categorieModel,populateFilter);
    //    return res.status(200).json({data:data})
    //  } catch (error) {
    //    return res.status(500).json({
    //      error:error
    //    })
    //  }
  }

  demo_function = (parentId) => {
    this.categorieModel.find({ parentId: parentId }, (err, res) => {
      if (err) {
        reject(err)
      }
      var categoryArray = [];
      for (let i = 0; i < res.length; i++) {
        // data[i]['subcategory'] = this.getSubCategory(data[i]._id)
        // var test = await this.test(data[i]._id)
        // console.log(test);
        console.log(res, ">>>>>>>>>>");
        const tes = this.demo_function(res[i]._id)
        console.log(tes);
        // this.getSubCategory(res[i]._id,(err,result)=>{
        //    console.log(result,">>>>>>>>>");
        //   categoryArray.push({'_id' : res[i]._id, 'title' : res[i].title, 'subcategory' : result});

        // })
        // console.log( temp,".............");
      }

      // resolve(categoryArray)
    })
  }

  /*
     GET   CATEGORIES DETAILS METHOD 
  */

  categorieDetails = async (req, res) => {
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
        var data = await this.categorieModel.findOne({ _id: _id, isDeleted: false }).populate('parentId').select('title icon ');
        return res.status(200).json({ data: data });

      }
    }
    catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  /*
    ADD   CATEGORIES  METHOD 
 */

  addCategorie = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        console.log(req.body);
        const payload = req.body;
        if(payload.parentId){
          payload['payload'] =[payload.parentId]
        }
        let icon = await base64toImage(payload.icon, "upload/", moment().format('DDMMYYhhiiss') + "image");
        payload['icon'] = icon
        console.log(payload);
        await this.add(this.categorieModel, payload)
        return res.status(200).json({ message: "add categorie" });
      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  /*
    UPDATE   CATEGORIES DETAILS METHOD 
 */

  updateCategorie = async (req, res) => {
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
        if (payload.icon) {
          payload['icon'] = await base64toImage(payload.icon, "upload/", moment().format('DDMMYYhhiiss') + "image");
        }
        await this.updateOne(this.categorieModel, _id, payload);
        return res.status(200).json({ message: "update categories" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  /*
    DELETE  CATEGORIES DETAILS METHOD 
 */

  deleteCategorie = async (req, res) => {
    try {
      var id = req.params.id;
      await this.deleteOne(this.categorieModel, id);
      return res.status(200).json({ message: "delete delete" })
    } catch (error) {
  
      return res.status(500).json({ error: error })
    }
  }
  
}

module.exports = CategorieController

