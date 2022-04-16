
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
    allList(model, query){
     return new Promise((resolve,reject)=>{
         model.find(query, (err,res)=>{
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
    findByEmail(model,email){
        return new Promise((resolve,reject)=>{
            model.findOne({email:email},(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
    }
    async updateOne(model,id,data){
        return new Promise((resolve,reject)=>{
            model.findOneAndUpdate({_id:id},data,(err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
            // try {
            //     var res = await model.findOneAndUpdate({_id:id},data,{upsert:true}).catch(err=>{
            //         reject(err)
            //     });
            //     resolve(res)
            // } catch (error) {
            //     reject(error)
            // }
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