const { UserValidParam } = require("../utls/validations")
var ObjectID = require("mongodb").ObjectID;

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
            model.find({ status: 0 }, (err, res) => {
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
            model.find({ status: 1 }, (err, res) => {
                if (err) {
                    reject(err)
                    console.log(err);
                }
                resolve(res)
            })
        })
    }
    approvePaginationlist(model,option) {
        return new Promise(async (resolve, reject) => {
            try {
                var myAggregate =  await model.find({status:1});
                // console.log(myAggregate);
                var data = await model.aggregatePaginate(myAggregate, option);
                // console.log(data);
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    };
    pendingPaginationlist(model,option) {
        return new Promise(async (resolve, reject) => {
            try {
                var myAggregate =  await model.find({status:0});
                // console.log(myAggregate);
                var data = await model.aggregatePaginate(myAggregate, option);
                // console.log(data);
                resolve(data)
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
    };

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