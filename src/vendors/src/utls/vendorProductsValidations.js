const { body, check, param } = require('express-validator');
const { models } = require('../../../database/index')

const authUserModel = models.authUserModel
const vendorModel = models.vendorProductModel;
const productsModel = models.productsModel

const errorMessage = {
    required:"This field is required"
}


// export


// options['price'] = payload.price
// options['product_id'] = payload.product_id;
// options['product_title'] = payload.product_title;
// options['description'] = payload.description;
// options['short_description'] = payload.short_description
// options['discount'] = payload.discount
// options['inventory'] = payload.inventory
// await this.add(this.vendorProductModel,options);
exports.createVendorProduct = [
    check('price').notEmpty().withMessage(errorMessage.required),
    check('product_id').notEmpty().withMessage(errorMessage.required).isString(),
    check('product_title').notEmpty().withMessage(errorMessage.required).isString(),
    check('description').notEmpty().withMessage(errorMessage.required),
    check('short_description').notEmpty().withMessage(errorMessage.required),
    check('inventory').notEmpty().withMessage(errorMessage.required),
    check('product_delivery_boy_day').optional().notEmpty().withMessage(errorMessage.required),
    check('product_return_time').optional().notEmpty().withMessage(errorMessage.required),
    check('product_return_day').optional().notEmpty().withMessage(errorMessage.required),
]

exports.updateVendorProduct = [
    check('price').optional().notEmpty().withMessage(errorMessage.required),
    check('product_id').optional().notEmpty().withMessage(errorMessage.required).isString(),
    check('product_title').optional().notEmpty().withMessage(errorMessage.required).isString(),
    check('description').optional().notEmpty().withMessage(errorMessage.required),
    check('short_description').optional().notEmpty().withMessage(errorMessage.required),
    check('inventory').optional().notEmpty().withMessage(errorMessage.required),
    check('product_delivery_boy_day').optional().notEmpty().withMessage(errorMessage.required),
    check('product_return_time').optional().notEmpty().withMessage(errorMessage.required),
    check('product_return_day').optional().notEmpty().withMessage(errorMessage.required),
]
exports.authUser = [
    check('user_id').notEmpty().withMessage("This field is required").isString().withMessage('Invalid input type'),
    check('product_id').notEmpty().withMessage("This feild is required"),
    check('price').notEmpty().withMessage("This feild is required"),
    check('description').notEmpty().withMessage("This field is required").isString().withMessage("invalid input type"),
    check('product_images').optional().isArray().withMessage("invalid input type"),
    check('inventory').notEmpty().withMessage("This feild is required").isNumeric().withMessage("ivalid input type"),
]


// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),

exports.categorieUpdate = [
    check('title').isLength({ min: 3 }).custom((value, { req }) => {
        return categorieModel.findOne({ title: value }).then(data => {
            if (data) {
                return Promise.reject('try unique title')
            }
        })

    }),
    check('icon')
]

exports.productDetailsvalidParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return vendorModel.findOne({ _id: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        }).catch(err=>{

            return Promise.reject('Invalid param Id')
        })
    })
]

exports.validParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return vendorModel.findOne({ _id: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        })
    }),
]

exports.UserValidParam = [
    param('id').notEmpty().withMessage('required param').custom((id) => {
        return authUserModel.findOne({ _id: id }).then(data => {
            if (!data) {

                return Promise.reject('Invalid param Id')
            }
        })
    }),
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

// param('id').customSanitizer((value, { req }) => {
//     return req.query.type === 'user' ? ObjectId(value) : Number(value);
//   }),
