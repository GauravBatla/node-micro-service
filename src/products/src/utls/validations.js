const {body, check ,param} = require('express-validator');
const {models} = require('../../../database/index')

const productsModel = models.productsModel


exports.products = [
    check("parentId").optional().notEmpty(),
    // check("categories.*.categorieId").optional().notEmpty(),
    check("productType").notEmpty().isString().isIn(['simple', 'configurable']),
    check('familyAtrributeId').notEmpty(),
    check("sku").notEmpty().custom((value)=>{
        // uniqueCheck(productsModel,{sku:value})
        return productsModel.findOne({sku:value}).then(data=>{
            // console.log(data);
            if(data){
                throw new Error("try unique sku")
            }
           
        }) 
    }),
    check("productAttribute.*.attributeId").optional().notEmpty(),
    check("productAttribute.*.attribute_value").optional().notEmpty(),
    check("images.*.image").optional().notEmpty(),
    check("images.*.is_primary").optional().notEmpty().isBoolean(),
    check("relatedProducts.*.productId").optional().notEmpty(),
    check("discount").optional().isNumeric(),


     // changes
     check('meta_title').isString().withMessage("invalid type"),
     check('meta_tags').isString().withMessage("invalid type"),
     check('meta_description').isString().withMessage("invalid type"),
     check('variantProductAttribute').optional().notEmpty().isArray(),
     check('variantProductAttribute.*.option').optional().notEmpty(),
     check('variantProductAttribute.*.attributeId').optional().notEmpty()
    
]
exports.configurableProducts = [
    check("parentId").optional().notEmpty(),
    // check("categories.*.categorieId").optional().notEmpty(),
    check("productType").notEmpty().isString().isIn(['simple', 'configurable']),
    check('familyAtrributeId').notEmpty(),
    check("sku").notEmpty().custom((value)=>{
        // uniqueCheck(productsModel,{sku:value})
        return productsModel.findOne({sku:value}).then(data=>{
            // console.log(data);
            if(data){
                throw new Error("try unique sku")
            }
           
        }) 
    }),
    check("productAttribute.*.attributeId").optional().notEmpty(),
    check("productAttribute.*.attribute_value").optional().notEmpty(),
    check("images.*.image").optional().notEmpty(),
    check("images.*.is_primary").optional().notEmpty().isBoolean(),
    check("relatedProducts.*.productId").optional().notEmpty(),

    check("discount").optional().isNumeric(),

     // changes
     check('meta_title').isString().withMessage("invalid type"),
     check('meta_tags').isString().withMessage("invalid type"),
     check('meta_description').isString().withMessage("invalid type"),
     check('variantProductAttribute').notEmpty().isArray(),
     check('variantProductAttribute.*.option').notEmpty(),
     check('variantProductAttribute.*.attributeId').notEmpty()
    
]
exports.productsStep1 = [
    check("productType").notEmpty().isString().isIn(['simple', 'configurable']),
    check('familyAtrributeId').notEmpty(),
    check("sku").notEmpty().custom((value)=>{
        // uniqueCheck(productsModel,{sku:value})
        return productsModel.findOne({sku:value}).then(data=>{
            console.log(data);
            if(data){
                throw new Error("try unique sku")
            }  
        }) 
    }),
    
      // changes
      check("categories.*.categorieId").notEmpty(),
      check('product_name').notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
      check('product_code').notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
      check('description').notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
      check('short_description').notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
      check('product_price').notEmpty().withMessage('This feild is required').isNumeric().withMessage("invalid type"),
]


exports.imageUpdate = [
    check('images.*.image').notEmpty().withMessage('This feild is required'),
    check('images.*.is_primary').notEmpty().withMessage('This feild is required').isBoolean()
]


exports.update = [
        check("productType").optional().notEmpty().isString().isIn(['simple', 'configurable']),
        check('familyAtrributeId').optional().notEmpty(),
        check("sku").optional().notEmpty().custom((value)=>{
            // uniqueCheck(productsModel,{sku:value})
            return productsModel.findOne({sku:value}).then(data=>{
                console.log(data);
                if(data){
                    throw new Error("try unique sku")
                }  
            }) 
        }),
      // changes
        check("categories.*.categorieId").notEmpty(),
        check("discount").optional().isNumeric(),
        check('product_name').optional().notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
        check('product_code').optional().notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
        check('description').optional().notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
        check('short_description').optional().notEmpty().withMessage("This feild is required").isString().withMessage("invalid type"),
        check('product_price').optional().notEmpty().withMessage('This feild is required').isNumeric().withMessage("invalid type"),
        check('meta_title').optional().notEmpty().withMessage("This feild is required"),
        check('meta_tags').optional().notEmpty().withMessage("this feild is required"),
        check('meta_description').optional().notEmpty(),
        check('productAttribute.*.attributeId').optional().notEmpty(),
        check('images.*.image'),
        check('inventory').optional().notEmpty(),
    ]

