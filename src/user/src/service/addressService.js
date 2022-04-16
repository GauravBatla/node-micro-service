const { UserValidParam } = require("../utls/addressValidations")
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
    ]
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
    aggregateFilter(model, id) {
        return new Promise((resolve, reject) => {
            model.aggregate(
                [
                    {
                        $lookup: {
                            from: 'auth_users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user_id'
                        },
                    },
                    { $match: { 'user_id._id': new ObjectID(id) } },
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
    async aggregatePaginate(model, option) {
        return new Promise(async (resolve, reject) => {
            try {
                var myAggregate = model.aggregate(this.filter);
                var data = await model.aggregatePaginate(myAggregate, option);
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = MongooseService