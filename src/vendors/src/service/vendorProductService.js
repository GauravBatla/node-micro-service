const { UserValidParam } = require("../utls/vendorProductsValidations")
var ObjectID = require("mongodb").ObjectID;
const mongoose = require('mongoose')
class MongooseService {
    constructor() { }
    add(model, data) {
        return new Promise((resolve, reject) => {
            model.create(data, (err, res) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(res)
                }
            })
        })
    };

    pendinglist(model) {
        return new Promise((resolve, reject) => {
            model.aggregate([
                { $match: { status: 'pending' } },
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

                }

            ], (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
                resolve(res)
            })
        })
    }
    approvelist(model) {
        return new Promise((resolve, reject) => {
            model.aggregate([
                { $match: { status: 'approve' } },
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

                }

            ], (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
                resolve(res)
            })
        })
    }

    allListByCategory(model, id) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [
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
                            as: 'test'
                        },
                    },
                    {
                        $addFields: {
                            "user_id": {
                                $map: {
                                    input: { $zip: { inputs: ["$user_id", "$user_id"] } },
                                    in: { $mergeObjects: "$$this" },

                                },

                            },

                        },

                    },
                    {
                        $addFields: {
                            "product_id.categories.categorieId": {
                                $map: {
                                    input: { $zip: { inputs: ["$test", "$test"] } },
                                    in: { $mergeObjects: "$$this" },

                                },

                            },

                        },

                    },
                    {
                        $project: {
                            product_id: true,
                            user_id: true,
                            price: true,
                            description: true,
                            product_images: true,
                            inventory: true
                        }
                    }, { $match: { 'product_id.categories.categorieId._id': new mongoose.Types.ObjectId(id) } },
                ]

                , (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                })
        })
    };
    allList(model, id) {
        return new Promise((resolve, reject) => {
            console.log(model, id);
            // console.log(id);
            model.aggregate(
                [
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
                        $addFields: {
                            "user_id": {
                                $map: {
                                    input: { $zip: { inputs: ["$user_id", "$user_id"] } },
                                    in: { $mergeObjects: "$$this" },

                                },

                            },

                        },
                    },
                    {
                        $lookup: {
                            localField: 'product_id.categories.categorieId',
                            from: 'categories',
                            foreignField: '_id',
                            as: 'test'
                        },
                    },
                    {
                        $addFields: {
                            "product_id.categories.categorieId": {
                                $map: {
                                    input: { $zip: { inputs: ["$test", "$test"] } },
                                    in: { $mergeObjects: "$$this" },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            product_id: true,
                            user_id: true,
                            price: true,
                            description: true,
                            product_images: true,
                            inventory: true
                        }
                    },
                    { $match: { 'user_id._id': new mongoose.Types.ObjectId(id) } },
                ]

                , (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                })
        })
    };
    vendorAllList(model) {
        return new Promise((resolve, reject) => {
            model.find({}, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            }).populate(['user_id', 'product_id'])
        })
    }

    findOne(model, id) {
        return new Promise((resolve, reject) => {
            model.aggregate([
                { $match: { _id: new ObjectID(id) } },
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
                        from: 'product_id.categories.categorieId',
                        localField: 'categories',
                        foreignField: '_id',
                        as: 'test'
                    },
                },
                {
                    $lookup: {
                        from: 'product_id.familyAtrributeId',
                        localField: 'attribute_familys',
                        foreignField: '_id',
                        as: 'test1'
                    },
                },
                {
                    $addFields: {
                        "product_id.categories.categorieId": {
                            $map: {
                                input: { $zip: { inputs: ["$test", "$test"] } },
                                in: { $mergeObjects: "$$this" },

                            },
                        },

                    },

                },

            ], (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
                console.log(res);
                resolve(res)
            })
        })
    }

    aggregateScheam(model, filter) {
        return new Promise((resolve, reject) => {
            model.aggregate(filter, (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
                console.log(res);
                resolve(res)
            })
        })
    }
    deleteOne(model, id) {
        return new Promise((resolve, reject) => {
            model.deleteOne({ _id: id }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }
    async updateOne(model, id, data) {
        return new Promise((resolve, reject) => {
            model.findOneAndUpdate({ _id: id }, data, { upsert: true }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })

        })
    }

    async aggregatePaginate(model, aggregate, option) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(model);
                var myAggregate = model.aggregate(aggregate);
                var data = await model.aggregatePaginate(myAggregate, option);
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }
    listPaginate(model,query,options){
        return new Promise((resolve,reject)=>{
            console.log(model,options,query)
            model.paginate(query, options,(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
    }

}

module.exports = MongooseService