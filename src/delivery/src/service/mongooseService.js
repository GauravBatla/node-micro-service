
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
    }
    allList(model) {
        return new Promise((resolve, reject) => {
            model.populate((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    vendorAllList(model) {
        return new Promise((resolve, reject) => {
            model.find((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            }).populate('user_id')
        })
    }

    findOne(model, id) {
        return new Promise((resolve, reject) => {
            model.findOne({ _id: id }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            }).populate('user_id')
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
    aggregateFilter  (model,filter){
        return new Promise((resolve,reject)=>{
            model.aggregate(
                filter
            ).exec( function (err, invites) {
                if (err) {
                 reject(err)
                }
                resolve(invites)
              }
            );
        })
    }

    async aggregatePaginate(model,aggregate,option){
        return new Promise(async(resolve,reject)=>{
          try {
            var myAggregate = model.aggregate(aggregate);
          var data = await  model.aggregatePaginate(myAggregate, option);
          resolve(data)
          } catch (error) {
              reject(error)
          }
        })
    }  

}

module.exports = MongooseService