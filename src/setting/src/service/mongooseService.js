const { UserValidParam } = require("../utls/validations")
var ObjectID = require("mongodb").ObjectID;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
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
    filter = [
      
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
                user_id: {
                    $map: {
                        input: { $zip: { inputs: ["$user_id"] } },
                        in: { $mergeObjects: "$$this" },
                    },
                },
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product_id',
                foreignField: '_id',
                as: 'product_id'
            },

        },
        // {
        //     $addFields: {
        //         "vendor_product_id.product_id": {
        //             $map: {
        //                 input: { $zip: { inputs: ["$product_id"] } },
        //                 in: { $mergeObjects: "$$this" },
        //             },
        //         },
        //     },
        // },

    ]

    async pendinglist(model, option) {
        return new Promise(async(resolve, reject) => {
            try {
              let newfilter =  [
                  {$match:{status:0}},
                {
                    
                    $lookup: {
                        from: 'vendor_products',
                        localField: 'vendor_product_id',
                        foreignField: '_id',
                        as: 'vendor_product_id'
                    },
                },
                {
                    $addFields: {
                        vendor_product_id: {
                            $map: {
                                input: { $zip: { inputs: ["$vendor_product_id"] } },
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
                    $addFields: {
                        user_id: {
                            $map: {
                                input: { $zip: { inputs: ["$user_id"] } },
                                in: { $mergeObjects: "$$this" },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'vendor_product_id.product_id',
                        foreignField: '_id',
                        as: 'product_id'
                    },
        
                },
                {
                    $addFields: {
                        "vendor_product_id.product_id": {
                            $map: {
                                input: { $zip: { inputs: ["$product_id"] } },
                                in: { $mergeObjects: "$$this" },
                            },
                        },
                    },
                },
        
            ]
            if(option == "none"){
                var myAggregate =  model.aggregate(newfilter)
                // var data = await model.aggregatePaginate(myAggregate, option);
                resolve(myAggregate)
            }else{

                var myAggregate =  model.aggregate(newfilter)
    
                var data = await model.aggregatePaginate(myAggregate, option);
                resolve(data)
            }
            
                // }
            } catch (error) {
                reject(error)
            }
        })
    }
    approvelist(model,option) {
        return new Promise(async(resolve, reject) => {
            try {
              let newfilter =  [
                  {$match:{status:1}},
                {
                    
                    $lookup: {
                        from: 'vendor_products',
                        localField: 'vendor_product_id',
                        foreignField: '_id',
                        as: 'vendor_product_id'
                    },
                },
                {
                    $addFields: {
                        vendor_product_id: {
                            $map: {
                                input: { $zip: { inputs: ["$vendor_product_id"] } },
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
                    $addFields: {
                        user_id: {
                            $map: {
                                input: { $zip: { inputs: ["$user_id"] } },
                                in: { $mergeObjects: "$$this" },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'vendor_product_id.product_id',
                        foreignField: '_id',
                        as: 'product_id'
                    },
        
                },
                {
                    $addFields: {
                        "vendor_product_id.product_id": {
                            $map: {
                                input: { $zip: { inputs: ["$product_id"] } },
                                in: { $mergeObjects: "$$this" },
                            },
                        },
                    },
                },
        
            ]
            if(option == "none"){
                var myAggregate =  model.aggregate(newfilter)
                // var data = await model.aggregatePaginate(myAggregate, option);
                resolve(myAggregate)
            }else{

                var myAggregate =  model.aggregate(newfilter)
    
                var data = await model.aggregatePaginate(myAggregate, option);
                resolve(data)
            }
            
                // }
            } catch (error) {
                reject(error)
            }
        })
    }

    allList(model) {
        return new Promise((resolve, reject) => {
            model.find((err, res) => {
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
            })
        })
    }

    findOne(model, id) {
        return new Promise((resolve, reject) => {
            model.findOne(id, (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
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
            model.findByIdAndUpdate(id, data, (err, res) => {
                if (err) {
                    reject(err)
                    // console.log(err);
                }
                // console.log(res);
                resolve(res)

            })

        })
    }
    aggregateFilter(model) {
        return new Promise((resolve, reject) => {
            model.find(
            ).exec(function (err, invites) {
                if (err) {
                    reject(err)
                }
                resolve(invites)
            }
            );
        })
    }
    async aggregatePaginate(model, option) {
        return new Promise(async (resolve, reject) => {
            try {
                var myAggregate = model.find();
                var data = await model.aggregatePaginate(myAggregate, option);
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = MongooseService