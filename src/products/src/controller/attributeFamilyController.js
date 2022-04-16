const AttributeFamilyService = require('../service/attributeFamilyService');
const express = require('express');
const { validationResult } = require('express-validator');
const { HttpMethods } = require('../utls/error')
const mongoose = require('mongoose')
let {models}= require('../../../database/index')
class attributeFamilyController extends AttributeFamilyService {
    path = '/attribute-family';
    params = '/:id'
    adminRouter = express.Router();
    jwtToken = require('../middleware/jwtTokenMiddleware')
    adminToken = require('../middleware/adminPermission')
    validation = require('../utls/attributeValidations');
    attributeFamilyModel = models.attributeFamilyModel
    attributeModel = models.attributeModel
    constructor() {
        super()
        this.selectPath = this.path + "/select";
        this.pathConfigurableAttribute = this.path + "-configurable";
        this.HttpMethods = HttpMethods;
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.adminRouter.get(this.path, this.jwtToken,this.adminToken,this.getAttributeFamily);
        // for vendor app

        this.adminRouter.get(this.path+'-apk', this.jwtToken,this.getAttributeFamily);
        this.adminRouter.get(this.path+'-apk' + this.params,this.jwtToken, this.getDetailsAttributeFamily);

        //end
        this.adminRouter.get(this.path + this.params,this.jwtToken,this.adminToken, this.getDetailsAttributeFamily);
        // this.adminRouter.get(this.selectPath, this.selectGetAttributeFamily);
        this.adminRouter.get(this.pathConfigurableAttribute, this.jwtToken,this.adminToken,this.configurableAttributeFamily)
        this.adminRouter.post(this.path, this.validation.attributeFamily,this.jwtToken,this.adminToken, this.addAttributeFamily);
        this.adminRouter.put(this.path + this.params, this.jwtToken,this.adminToken,this.validation.attributeFamilyUpdate, this.updateAttributeFamily);
        this.adminRouter.delete(this.path + this.params,this.jwtToken,this.adminToken, this.validation.attributeFamilyDelete, this.deleteAttributeFamily);
        this.adminRouter.get('/is-configurable', this.jwtToken,this.adminToken,this.isConfigurableGet)
        this.adminRouter.get('/is-configurable/:id', this.jwtToken,this.adminToken,this.isConfigurableDetails)

    }

    isConfigurableGet = async (req, res) => {
        try {
            const filterData = [
                {

                    $lookup: {
                        from: 'attributes',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$isConfigurable", true] },
                                            { $eq: ["$type", "select"] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'family_attribute'
                    },

                },
                { $match: { "isDeleted": false, } }

            ]
            const data = await this.aggregateFilter(this.attributeFamilyModel, filterData)
            //   const data = await this.attributeFamilyModel.find({"isConfigurable":true,"type":"select"}).populate('family_attribute');
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    isConfigurableDetails = async (req, res) => {
        try {
            const _id = req.params.id;
            const filterData = [
                { $match: { "_id": mongoose.Types.ObjectId(_id) } },
                {
                    $lookup: {
                        from: 'attributes',
                        localField: 'family_attribute',
                        foreignField: '_id',

                        as: 'family_attribute'
                    },
                },
                { $match: { "family_attribute.isConfigurable": true, "family_attribute.type": "select" } },
            ]
            const data = await this.aggregateFilter(this.attributeFamilyModel, filterData)
            //   const data = await this.attributeFamilyModel.find({"isConfigurable":true,"type":"select"}).populate('family_attribute');
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    getDetailsAttributeFamily = async (req, res) => {
        try {
            var _id = req.params.id;
            // return res.json({test:_id})
            const data = await this.attributeFamilyModel.findOne({ _id: _id }).populate("family_attribute")
            return res.status(this.HttpMethods.Success.status).json({ data: data })
        } catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })

        }
    }
    getAttributeFamily = async (req, res) => {
        try {
            const { page, limit } = req.query;
            const search = req.query.search;
            var querys = { isActive: true, isDeleted: false };
            if (search) {
                let regex = new RegExp(`${req.query.search}`)
                querys["name"] = regex
            }

            console.log(querys);
            var options = {

                populate: 'family_attribute',
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 1,
            };
            // const data = await this.listPaginate(this.attributeFamilyModel,querys,options)
            const data = await this.attributeFamilyModel.find(querys).populate('family_attribute')
            return res.status(this.HttpMethods.Success.status).json({ data: data });
        }
        catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })
        }
    }
    configurableAttributeFamily = async (req, res) => {
        try {
            var id = "619c6d472aebe0ae670c0680"
            var attributesId = await this.attributeModel.find({ type: "select" });

            // var data = await this.attributeFamilyModel.findOne({"group.family_attribute.attribute_id":attributesId}).populate('group.family_attribute.attribute_id');
            var data = await this.attributeFamilyModel.find()
            //    console.log(data);

            // const arrayColumn = data['group'].map(x => x['family_attribute']);
            // console.log("----------------------------------");
            // var attribute_data = [];
            // // console.log(arrayColumn);
            // for (let i = 0; i < arrayColumn.length; i++) {
            //     for (let j = 0; j < arrayColumn[i].length; j++) {
            //         if(arrayColumn[i][j]['attribute_id'] !== null) {

            //             attribute_data.push(arrayColumn[i][j])
            //         }

            //     }

            // }


            // var filter = 

            // var populateFilter = [
            //     // { $unwind : "$attributes" },
            //     {$match:{"_id":this.mongoose.Types.ObjectId(id)}},

            //     {
            //         $lookup: {
            //          from: 'attributes',
            //         //  localField: 'group.family_attribute.attribute_id',
            //         //  foreignField: '_id',
            //           let: { type: "$type" },
            //           pipeline: [
            //             { $match:
            //                { $expr:
            //                   { $and:
            //                      [
            //                        { $eq: [ "$type",  "select" ] },
            //                     //    { $gte: [ "$instock", "$$order_qty" ] }
            //                      ]
            //                   }
            //                }
            //             },
            //             // { $project: { stock_item: 0, _id: 0 } }
            //          ],
            //          as: 'attributeId'
            //        },



            //   },

            //   ];

            //  var data= await this.aggregateFilter(this.attributeFamilyModel,populateFilter);



            return res.status(this.HttpMethods.Success.status).json({ "data": "attributesId" })
        } catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
        }
    }
    selectGetAttributeFamily = async (req, res) => {
        try {
            var querys = { isActive: true, isDeleted: false };
            var data = await this.attributeFamilyModel.find(querys).select('name group');
            return res.status(this.HttpMethods.Success.status).json(data)
        } catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
        }
    }
    addAttributeFamily = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(this.HttpMethods.UnprocessableEntity.status).json({
                    message: errors.msg,
                    errors: errors.errors
                })
            }
            else {
                let payload = req.body;
                console.log(req.body);
                // if (!payload.group) {
                //     return res.status(this.HttpMethods.UnprocessableEntity.status).json({
                //         error: "group is required"
                //     })
                // }
                // else {
                if (!payload.family_attribute) {
                    return res.status(this.HttpMethods.UnprocessableEntity.status).json({
                        error: "required group array in family_attribute array"
                    })
                }
                else {
                    var newAttribute = new this.attributeFamilyModel({
                        name: payload.name,
                        status: payload.status,
                        family_attribute: payload.family_attribute
                    });

                    await this.add(this.attributeFamilyModel, newAttribute).then(data => {
                        if (data) {
                            res.status(this.HttpMethods.Success.status).json({ message: "create attribute family" })
                        }
                    });
                    // await this.attributeFamilyModel.createIndexes(payload.group[0].family_attribute);
                }
                // }

            }
        } catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: error })
        }
    }

    deleteAttributeFamily = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(this.HttpMethods.UnprocessableEntity.status).json({
                    message: errors.msg,
                    errors: errors.errors
                })

            }
            else {
                var _id = req.params.id;
                await this.tempDelete(this.attributeFamilyModel, _id).then(data => {
                    res.status(this.HttpMethods.Success.status).json({ message: "delete successfuly" })
                });

            }
        } catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })

        }
    }

    updateAttributeFamily = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(this.HttpMethods.UnprocessableEntity.status).json({
                    message: errors.msg,
                    errors: errors.errors
                })
            }
            else {
                let payload = req.body;
                var _id = req.params.id
                await this.updateOne(this.attributeFamilyModel, _id, payload).then(data => {
                    if (data) {
                        res.status(this.HttpMethods.Success.status).json({ message: "update attribute family" })
                    }
                })
            }
        } catch (error) {
            return res.status(this.HttpMethods.InternalServerError.status).json({ error: this.HttpMethods.InternalServerError.error })
        }
    }


}

module.exports = attributeFamilyController