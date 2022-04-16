
class MongooseService {
    constructor(){}
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
    allList(model){
     return new Promise((resolve,reject)=>{
         model.find((err,res)=>{
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
            })
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
}

module.exports = MongooseService