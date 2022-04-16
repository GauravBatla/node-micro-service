
class MongooseService {
    constructor(){
        this.mongoose = require('mongoose');
        this.ObjectId = this.mongoose.Schema.Types;
    }
    getObjectId(Id){
        console.log(Id);
        return this.ObjectId.ObjectId(Id)
    }
    add(model,data){
     return new Promise((resolve,reject)=>{
        model.create(data,(err,res)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(res)
            }
        })
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

    

    allList(model){
    var filter = [
        {
            path:"parentId"
        }
    ]  
   return new Promise((resolve,reject)=>{
     model.find((error,res)=>{
         if(error){
             reject(error)
         }
         else{
             resolve(res)
         }
     })
   }).populate(filter)
}



     findOne(model,id){
        return new Promise((resolve,reject)=>{
            model.findOne({_id:id},(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            }).population('parentId')
        })
    }
    deleteOne(model,id){
        return new Promise((resolve,reject)=>{
            model.deleteOne({_id:id},(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
    }
    async updateOne(model,id,data){
        return new Promise((resolve,reject)=>{
            model.findOneAndUpdate({_id:id},data,{upsert:true},(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
           
        })
    }
   

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