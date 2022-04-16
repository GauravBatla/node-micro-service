const { UserValidParam } = require("../utls/validations")
var ObjectID = require("mongodb").ObjectID;
var mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const { models } = require('../../../database/index')
const CartModel = models.addtoCartModel
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
    filter = [
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
        // {
        //     $addFields: {
        //         vendor_product_id: {
        //             $map: {
        //                 input: { $zip: { inputs: ["$vendor_id"] } },
        //                 in: { $mergeObjects: "$$this" },
        //             },
        //         },
        //     },
        // },
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
    ]


    async pendinglist(model, option) {
        return new Promise(async (resolve, reject) => {
            try {
                let newfilter = [
                    { $match: { status: 0 } },
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
                if (option == "none") {
                    var myAggregate = model.aggregate(newfilter)
                    // var data = await model.aggregatePaginate(myAggregate, option);
                    resolve(myAggregate)
                } else {

                    var myAggregate = model.aggregate(newfilter)

                    var data = await model.aggregatePaginate(myAggregate, option);
                    resolve(data)
                }

                // }
            } catch (error) {
                reject(error)
            }
        })
    }
    approvelist(model, option) {
        return new Promise(async (resolve, reject) => {
            try {
                let newfilter = [
                    { $match: { status: 1 } },
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
                if (option == "none") {
                    var myAggregate = model.aggregate(newfilter)
                    // var data = await model.aggregatePaginate(myAggregate, option);
                    resolve(myAggregate)
                } else {

                    var myAggregate = model.aggregate(newfilter)

                    var data = await model.aggregatePaginate(myAggregate, option);
                    resolve(data)
                }

                // }
            } catch (error) {
                reject(error)
            }
        })
    }
    allList(id) {
        return new Promise((resolve, reject) => {
            // console.log(id);
            CartModel.aggregate(
                [
                    {
                        $lookup: {
                            from: 'auth_users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user_id'
                        },
                    },
                    { $match: { 'user_id._id': new mongoose.Types.ObjectId(id) } },
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
                            from: 'vendor_products',
                            localField: 'vendor_product_id',
                            foreignField: '_id',
                            as: 'vendor_product_id'
                        },

                    },
                    {
                        $lookup: {
                            from: 'auth_users',
                            localField: 'vendor_product_id.user_id',
                            foreignField: '_id',
                            as: 'vendor_details'
                        },

                    },
                    { $project: { 'vendor_product_id': 1, user_id: 1, quantity: 1, total: { $multiply: [10, "$quantity"] } } },
                    { $project: { vendor_id: { $arrayElemAt: ["$vendor_product_id.user_id", 0] }, vendor_product_id: { $arrayElemAt: ["$vendor_product_id._id", 0] }, vendor_product_price: { $arrayElemAt: ["$vendor_product_id.price", 0] }, user_id: 1, quantity: 1, total_price: { $multiply: [{ $arrayElemAt: ["$vendor_product_id.price", 0] }, "$quantity"] } } }
                ]
                , (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    // console.log(res);
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
    filter = [
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
        // {
        //     $addFields: {
        //         vendor_product_id: {
        //             $map: {
        //                 input: { $zip: { inputs: ["$vendor_id"] } },
        //                 in: { $mergeObjects: "$$this" },
        //             },
        //         },
        //     },
        // },
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
    ]



    findOne(model, id) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [
                    { $match: { _id: new ObjectID(id) } },
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
                ]

                , (err, res) => {
                    if (err) {
                        reject(err)
                        console.log(err);
                    }
                    resolve(res)
                })
        })
    }
    // forNewOrderDelivery(model) {
    //     return new Promise((resolve, reject) => {
    //         model.aggregate(
    //              [
    //                 { $match: { vendor_status: 1 , deliveryBoy_status : 0 } },
    //                 {
    //                     $lookup: {
    //                         from: 'customer-addresses',
    //                         localField: 'user_address_id',
    //                         foreignField: '_id',
    //                         as: 'user_address_id'
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'coupons',
    //                         localField: 'coupan_id',
    //                         foreignField: '_id',
    //                         as: 'coupan_id'
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'auth_users',
    //                         localField: 'vendor_id',
    //                         foreignField: '_id',
    //                         as: 'vendor_id'
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'auth_users',
    //                         localField: 'user_id',
    //                         foreignField: '_id',
    //                         as: 'user_id'
    //                     },

    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'orderdetails',
    //                         localField: '_id',
    //                         foreignField: 'order_id',
    //                         as: 'product_details'
    //                     },

    //                 },
    //                 {
    //                     $addFields: {
    //                         user_id: {
    //                             $map: {
    //                                 input: { $zip: { inputs: ["$user_id"] } },
    //                                 in: { $mergeObjects: "$$this" },
    //                             },
    //                         },
    //                     },
    //                 },
    //             ]

    //         , (err, res) => {
    //             if (err) {
    //                 reject(err)
    //                 console.log(err);
    //             }
    //             resolve(res)
    //         })
    //     })
    // }
    forNewOrderDelivery(model) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [
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

                , (err, res) => {
                    if (err) {
                        reject(err)
                        console.log(err);
                    }
                    resolve(res)
                })
        })
    }
    // forActiveDeliveryOrder(model) {
    //     return new Promise((resolve, reject) => {
    //         model.aggregate(
    //              [
    //                 { $match: { vendor_status: 1  ,  deliveryBoy_status : 1 } },
    //                 {
    //                     $lookup: {
    //                         from: 'customer-addresses',
    //                         localField: 'user_address_id',
    //                         foreignField: '_id',
    //                         as: 'user_address_id'
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'coupons',
    //                         localField: 'coupan_id',
    //                         foreignField: '_id',
    //                         as: 'coupan_id'
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'auth_users',
    //                         localField: 'vendor_id',
    //                         foreignField: '_id',
    //                         as: 'vendor_id'
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'auth_users',
    //                         localField: 'user_id',
    //                         foreignField: '_id',
    //                         as: 'user_id'
    //                     },

    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'orderdetails',
    //                         localField: '_id',
    //                         foreignField: 'order_id',
    //                         as: 'product_details'
    //                     },

    //                 },
    //                 {
    //                     $addFields: {
    //                         user_id: {
    //                             $map: {
    //                                 input: { $zip: { inputs: ["$user_id"] } },
    //                                 in: { $mergeObjects: "$$this" },
    //                             },
    //                         },
    //                     },
    //                 },
    //             ]

    //         , (err, res) => {
    //             if (err) {
    //                 reject(err)
    //                 console.log(err);
    //             }
    //             resolve(res)
    //         })
    //     })
    // }


    forActiveDeliveryOrder(model) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [
                    { $match: { vendor_status: 1, deliveryBoy_status: 1 } },

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

                , (err, res) => {
                    if (err) {
                        reject(err)
                        console.log(err);
                    }
                    resolve(res)
                })
        })
    }
    forNewOrderVendor(model, id) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [
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
                    { $match: { vendor_status: 1, 'vendor_id._id': new ObjectID(id) } },
                ]

                , (err, res) => {
                    if (err) {
                        reject(err)
                        console.log(err);
                    }
                    resolve(res)
                })
        })
    }
    completeOrder(model, id) {
        return new Promise((resolve, reject) => {
            console.log(id, "id");
            model.aggregate(
                [
                    { $match: { 'delivery_boy_id': mongoose.Types.ObjectId(id) } },

                ]

                , (err, res) => {
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
            model.findOneAndUpdate({ _id: id }, data, { upsert: true }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })

        })
    }
    aggregateFilter(model) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                this.filter
            ).exec(function (err, invites) {
                if (err) {
                    reject(err)
                }
                resolve(invites)
            }
            );
        })
    }
    mYaggregateFilter(model,id) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [ 
                   { $match:{user_id:mongoose.Types.ObjectId(id)}},
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
                    // {
                    //     $addFields: {
                    //         vendor_product_id: {
                    //             $map: {
                    //                 input: { $zip: { inputs: ["$vendor_id"] } },
                    //                 in: { $mergeObjects: "$$this" },
                    //             },
                    //         },
                    //     },
                    // },
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
                ]
            ).exec(function (err, invites) {
                if (err) {
                    reject(err)
                }
                resolve(invites)
            }
            );
        })
    }
    aggregate(model, filter) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                filter
            ).exec(function (err, invites) {
                if (err) {
                    reject(err)
                }
                resolve(invites)
            }
            );
        })
    }
    // async aggregatePaginate(model, option) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             var myAggregate = model.aggregate(option);
    //             var data = await model.aggregatePaginate(myAggregate, option);
    //             resolve(data)
    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // }
    async aggregatePaginate(model, aggregate, option) {
        return new Promise(async (resolve, reject) => {
            try {
                var myAggregate = model.aggregate(aggregate);
                //   var data = await  model.aggregatePaginate(myAggregate, option);
                resolve(myAggregate)
            } catch (error) {
                reject(error)
            }

        })
    }
    async myaggregatePaginate(model, aggregate, option) {
        return new Promise(async (resolve, reject) => {
            try {
                var myAggregate = model.aggregate(aggregate);
                //   var data = await  model.aggregatePaginate(myAggregate, option);
                resolve(myAggregate)
            } catch (error) {
                reject(error)
            }

        })
    }

    findOrderDetail(model, id) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                 [
                    { $match: { order_id: new ObjectID(id) } },
                    {
                        $lookup: {
                            from: 'vendor_products',
                            localField: 'vendor_product_id',
                            foreignField: '_id',
                            as: 'order_details'
                        },
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'order_details.product_id',
                            foreignField: '_id',
                            as: 'product_id'
                        },
                    }
                    // {
                    //     $lookup: {
                    //         from: 'coupons',
                    //         localField: 'coupan_id',
                    //         foreignField: '_id',
                    //         as: 'coupan_id'
                    //     },
                    // },
                    // {
                    //     $lookup: {
                    //         from: 'auth_users',
                    //         localField: 'vendor_id',
                    //         foreignField: '_id',
                    //         as: 'vendor_id'
                    //     },
                    // },
                    // {
                    //     $lookup: {
                    //         from: 'auth_users',
                    //         localField: 'user_id',
                    //         foreignField: '_id',
                    //         as: 'user_id'
                    //     },
            
                    // },
                    // {
                    //     $lookup: {
                    //         from: 'orderdetails',
                    //         localField: '_id',
                    //         foreignField: 'order_id',
                    //         as: 'product_details'
                    //     },
            
                    // },
                //    , {
                //         $addFields: {
                //             user_id: {
                //                 $map: {
                //                     input: { $zip: { inputs: ["$user_id"] } },
                //                     in: { $mergeObjects: "$$this" },
                //                 },
                //             },
                //         },
                //     },
                ,{$project:{product_quantity:1 , price:1 , discount_price:1,total_price:1,'order_details.product_images.image':1, 'product_id.product_name':1, }}
                ]
            
            , (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
                resolve(res)
            })
        })
    }

}

module.exports = MongooseService