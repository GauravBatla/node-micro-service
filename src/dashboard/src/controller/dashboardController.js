const express = require('express');
const MongooseService = require('../service/mongooseService');
const { validationResult, check } = require('express-validator');
const {models} = require('../../../database/index')

const MongoClient = require('mongodb').MongoClient

class AreaController extends MongooseService {
  path = '/dashboard';
  params = '/:id'
  adminRouter = express.Router();
  
  constructor() {
    super()
    this.intializeRoutes()

    this.url = "mongodb+srv://sachin:XReivM35vXKLqb5Y@cluster0.oiold.mongodb.net/newEcomm?retryWrites=true&w=majority";

    this.client = new MongoClient(this.url, { useNewUrlParser: true });
    this.client.connect((err, database) => {
      this.db = database.db("ecomm")

    })
  }
  /*
   All Intialize Routes 
  */
  intializeRoutes() {
    // this.router.post(this.path, this.validation.authUser, this.AddArea);
    this.adminRouter.get(this.path, this.productApi);
    // this.router.get(this.path+this.params,this.validation.validParam,this.areaDetail)
    // this.router.put(this.path + this.params, this.validation.validParam, this.updateArea);
    // this.router.delete(this.path + this.params, this.validation.validParam, this.deleteArea);
    // this.router.post(this.path+'-verify',this.checkPincode)
  }

  productApi = async (req, res) => {
    try {
      //  const data = this.api1()
      const test = await this.productDashboardApi()
      const test1 = await this.arrea()
      const users = await this.users()
      const pendingVendors = await this.pendingVendor()
      const activeVendors = await this.ActiveVendor()
      const activeDeliveryBoys = await this.ActiveDeliveryBoy()
      const pendingDeliveryBoys = await this.pendingDeliveryBoy()
      const pendingVendorProducts = await this.pendingVendorProduct();
      const activeVendorProducts = await this.ApproveVendorProduct();
      const totalorders = await this.totalOrders();
      console.log(pendingVendors.length);
      return res.status(200).json({
        products: test ? test.length : 0, area: test1 ? test1.length : 0, users: users ? users.length : 0, PendingVendors: pendingVendors ? pendingVendors.length : 0, ActiveVendors: activeVendors ? activeVendors.length : 0,
        activeDeliveryBoys: activeDeliveryBoys ? activeDeliveryBoys.length : 0, pendingDeliveryBoys: pendingDeliveryBoys ? pendingDeliveryBoys.length : 0, pendingVendorProducts: pendingVendorProducts ? pendingVendorProducts.length : 0
        , activeVendorProducts: activeVendorProducts ? activeVendorProducts.length : 0, totalorders: totalorders ? totalorders.length : 0
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }


  async productDashboardApi() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('products').find().toArray((err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
          //  console.log(result,"data");
        });
      } catch (error) {
        reject(error)
      }
    })
  }
  async arrea() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('areas').find().toArray((err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
          //  console.log(result,"data");
        });
      } catch (error) {
        reject(error)
      }
    })
  }
  async users() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('auth_users').find().toArray((err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
          //  console.log(result,"data");
        });
      } catch (error) {
        reject(error)
      }
    })
  }
  async pendingVendor() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('vendors').aggregate([
          {
            $lookup: {
              from: 'auth_users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_id'
            },
          },
          { $match: { 'user_id.status': 'Pending' } }]).toArray((err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
            //  console.log(result,"data");
          });
      } catch (error) {
        reject(error)
      }
    })
  }
  async ActiveVendor() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('vendors').aggregate([
          {
            $lookup: {
              from: 'auth_users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_id'
            },
          },
          { $match: { 'user_id.status': 'approve' } }]).toArray((err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
            //  console.log(result,"data");
          });
      } catch (error) {
        reject(error)
      }
    })
  }
  async ActiveDeliveryBoy() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('delivery_boys').aggregate([
          {
            $lookup: {
              from: 'auth_users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_id'
            },
          },
          { $match: { 'user_id.status': 'approve' } }]).toArray((err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
            //  console.log(result,"data");
          });
      } catch (error) {
        reject(error)
      }
    })
  }
  async pendingDeliveryBoy() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('delivery_boys').aggregate([
          {
            $lookup: {
              from: 'auth_users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_id'
            },
          },
          { $match: { 'user_id.status': 'Pending' } }]).toArray((err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
            //  console.log(result,"data");
          });
      } catch (error) {
        reject(error)
      }
    })
  }
  async pendingVendorProduct() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('vendor_products').aggregate([
          // {
          //   $lookup: {
          //     from: 'auth_users',
          //     localField: 'user_id',
          //     foreignField: '_id',
          //     as: 'user_id'
          //   },
          // },
          { $match: { 'status': 'pending' } }]).toArray((err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
            //  console.log(result,"data");
          });
      } catch (error) {
        reject(error)
      }
    })
  }
  async ApproveVendorProduct() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('vendor_products').aggregate([
          // {
          //   $lookup: {
          //     from: 'auth_users',
          //     localField: 'user_id',
          //     foreignField: '_id',
          //     as: 'user_id'
          //   },
          // },
          { $match: { 'status': 'approve' } }]).toArray((err, result) => {
            if (err) {
              reject(err)
            }
            resolve(result)
            //  console.log(result,"data");
          });
      } catch (error) {
        reject(error)
      }
    })
  }
  async totalOrders() {
    return new Promise(async (resolve, reject) => {
      try {
        const test = await this.db.collection('orders').find().toArray((err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
          //  console.log(result,"data");
        });
      } catch (error) {
        reject(error)
      }
    })
  }

}


module.exports = AreaController