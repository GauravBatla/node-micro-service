const {body, check ,param,} = require('express-validator');
const {models} = require('../../../database/index')

const attributeFamilyModel = models.attributeFamilyModel
const attributeModel = models.attributeModel



const attributeType = [
    "textarea",
    "number",
    "radio",
    "select",
    "multiselect",
    "datetime-local",
    "date",
    "time",
    "file",
    "checkbox"

]

exports.attribute = [
    check('name')
    .notEmpty()
    .withMessage('This field is required')
    .isString(),
    check('code')
    .notEmpty()
    .withMessage('This field is required')
    .isString().custom((value)=>{
        return attributeModel.findOne({code:value}).then((data)=>{
            if(data){
                throw new Error('try unique code')
            }
        })
    }),
    check('type')
    .notEmpty()
    .withMessage('This field is required')
    .isIn(attributeType)
    .withMessage('only accpt '+attributeType),
    check('required')
    .notEmpty()
    .withMessage('This field is required')
    .toBoolean()
    .withMessage("Invalid Input Type"),
     check('status').notEmpty().withMessage('This field is required').isString(),
     check("option.*.option_name").custom((value,{req})=>{
         if(req.body.type == "multiselect"){
             if(!req.body.option[0].option_name){
                 return new Promise.reject('This field is required')
             }
             else{
                return true
             }
         }
         else{
            //  delete req.body.option
             return true
         }
     }),
     check("option.*.option_value").custom((value,{req})=>{
         if(req.body.type == "multiselect"){
             if(!req.body.option[0].option_value){
                 return new Promise.reject('This field is required')
             }
             else{
                return true
             }
         }
         else{
            // delete req.body.option
             return true
         }
     }),
     check("option.*.option_position").custom((value,{req})=>{
         if(req.body.type == "multiselect"){
             if(!req.body.option[0].option_position){
                 return new Promise.reject('This field is required')
             }
             else{
                return true
             }
         }
         else{
            // delete req.body.option
             return true
         }
     }),


] 


exports.attribute_update = [
    check('name')
    .notEmpty()
    .withMessage('This field is required')
    .isString(),
    check('code')
    .notEmpty()
    .withMessage('This field is required')
    .isString().custom((value,{req})=>{
        return attributeModel.findOne({_id:{$ne:req.params.id},code:value}).then((data)=>{
            if(data){
                throw new Error('try unique code')
            }
        })
    }),
    check('type')
    .notEmpty()
    .withMessage('This field is required')
    .isIn(attributeType)
    .withMessage('only accpt '+attributeType),
    check('required')
    .notEmpty()
    .withMessage('This field is required')
    .toBoolean()
    .withMessage("Invalid Input Type"),
     check('status').notEmpty().withMessage('This field is required').isString(),
     check("option.*.option_name").custom((value,{req})=>{
         if(req.body.type == "multiselect"){
             if(!req.body.option[0].option_name){
                 return new Promise.reject('This field is required')
             }
             else{
                return true
             }
         }
         else{
            //  delete req.body.option
             return true
         }
     }),
     check("option.*.option_value").custom((value,{req})=>{
         if(req.body.type == "multiselect"){
             if(!req.body.option[0].option_value){
                 return new Promise.reject('This field is required')
             }
             else{
                return true
             }
         }
         else{
            // delete req.body.option
             return true
         }
     }),
     check("option.*.option_position").custom((value,{req})=>{
         if(req.body.type == "multiselect"){
             if(!req.body.option[0].option_position){
                 return new Promise.reject('This field is required')
             }
             else{
                return true
             }
         }
         else{
            // delete req.body.option
             return true
         }
     }),


] 

exports.attributeFamily = [
    check('name').notEmpty().isString().isLength({min:3}).withMessage('min length 3 '),
    check('status').notEmpty().isString().withMessage('This field is required'),
    // check('group.*.group_name').notEmpty().withMessage('This field is required').isString(),
    // check('group.*.group_position').notEmpty().withMessage('This field is required').isString(),
    // check('group.*.family_attribute.*.attribute_id').notEmpty().withMessage('This field is required').isString(),
    check('family_attribute').notEmpty().isArray().withMessage('This field is required'),
   
]
exports.attributeFamilyUpdate = [
    check('name').notEmpty().isString().isLength({min:3}).withMessage('min length 3 '),
    check('status').notEmpty().isString().withMessage('This field is required'),
    // check('group.*.group_name').notEmpty().withMessage('This field is required').isString(),
    // check('group.*.group_position').notEmpty().withMessage('This field is required').isString(),
    // check('group.*.family_attribute.*.attribute_id').notEmpty().withMessage('This field is required').isString(),
    check('family_attribute').notEmpty().isArray().withMessage('This field is required'),
   
]


exports.attributeFamilyDelete = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return attributeFamilyModel.findOne({_id:id,isDeleted:false}).then(data=>{
            if(!data){
                return Promise.reject('Invalid param Id')
            }
        })
    }),
]
exports.attributeUpdate = [
    param('id').notEmpty().withMessage('required param') .custom((id)=>{
        return attributeModel.findOne({_id:id,isDeleted:false}).then(data=>{
            if(!data){
                return Promise.reject('Invalid param Id')
            }
        })
    }),
]
