
class MongooseService {
    constructor(){
        this.mongoose = require('mongoose')
    }
    ObjectId(Id){
        return this.mongoose.Types.ObjectId(Id)
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
            model.paginate(query, options,(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
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
    tempDelete(model,id){
        return new Promise((resolve,reject)=>{
            model.updateOne({_id:id},{isDeleted:true},{upsert:true}).then(data=>{
                if(data){
                    resolve({data:"delete"})
                }
            })
        }).catch(err=>{
            if(err){
                reject({error:"service error"})
            }
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
}

module.exports = MongooseService