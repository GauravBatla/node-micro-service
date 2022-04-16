const {body, check ,param} = require('express-validator');
const {models} = require('../../../database/index')

const categorieModel = models.categorieModel

exports.categorie = [
    check('parentId').custom((value,{req})=>{
        if(!req.body.parentId){
         return true
            
        }
        else{
            return categorieModel.findOne({_id:value}).then(data=>{
                console.log(data);
                if(!data){
                    return Promise.reject('Invalid parentId Id')
                }
            }).catch(err=>{
                if(err){
                    return Promise.reject('Invalid parentId Id')
                }
            })
        }
    }),
    check('title').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type').custom((value,{req})=>{
        return categorieModel.findOne({title:value}).then(data=>{
            if(data){
                return Promise.reject('try unique title')
            }
        })
      
    }),
    check('icon').notEmpty().withMessage("This field is required").withMessage('Invalid Buffer Data')
] 

exports.categorieUpdate = [
    check('parentId').optional().custom((value,{req})=>{
        if(!req.body.parentId){
         return true
        }
        else{
            return categorieModel.findOne({_id:value}).then(data=>{
                console.log(data);
                if(!data){
                    return Promise.reject('Invalid parentId Id')
                }
            }).catch(err=>{
                if(err){
                    return Promise.reject('Invalid parentId Id')
                }
            })
        }
    }),
    check('title').optional().notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type').custom((value,{req})=>{
        return categorieModel.findOne({title:value,_id:{$ne:req.params.id}}).then(data=>{
            if(data){
                return Promise.reject('try unique title')
            }
        })
      
    }),
    check('icon').optional().notEmpty().withMessage("This field is required").withMessage('Invalid Buffer Data')
]


exports.validParam = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return categorieModel.findOne({_id:id}).then(data=>{
            if(!data){

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
