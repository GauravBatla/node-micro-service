var categorieModel = require('../model/categorieModel');
module.exports={
    test:(data) =>{
        return new Promise((resolve,reject)=>{
            console.log(data,">>>>>>>>>>>>>>");
            resolve(data)
        })
    }
,
    hh: async function recurse(categoryId) {
        const data = await categorieModel.find({parentId:categoryId});
        console.log(data,"data");
        return data;
        // if(condition) {
        //     // stop calling itself
        //     //...
        // } else {
            
        // }
    }
}

