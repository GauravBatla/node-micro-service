
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

    allList(model){
   return new Promise((resolve,reject)=>{
     model.find((err,res)=>{
         if(err){
             resolve(err)
         }
         else{
             reject(res)
         }
     })
   });
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
                reject({error:"jhg"})
            }
        })
    }
}

module.exports = MongooseService