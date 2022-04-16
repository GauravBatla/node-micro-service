const express = require('express');
var Razorpay = require('razorpay');
const MongooseService = require('../service/mongooseService');
const { validationResult } = require('express-validator');
// const { find, } = require('../model/authUserModel');
const { password_hash, createOtp } = require('../utls/helper');
const {models} = require('../../../database/index')
const mongoose = require('mongoose')
const send_otp = require('../utls/sendOtp');
const bcrypt = require('bcryptjs')

var refreshTokens = {};
class AuthUserController extends MongooseService {
  registerPath = '/register';
  params = '/:id'
  userPath = '/user';
  loginPath = '/login';
  randtoken = require('rand-token');

  userInfo = {};
  JWT_SECREATE_kEY = 'test';
  test = require('../middleware/adminPermission')
  jwt = require('jsonwebtoken');
  jwtToken = require('../middleware/jwtTokenMiddleware');
  adminToken = require('../middleware/adminPermission')
  router = express.Router();
  adminRouter = express.Router();
  loginRoute = express.Router()
  VenderRoute = express.Router();

  validation = require('../utls/validations');
  authUserModel = models.authUserModel;
  referModel = models.userReferModel

  instance = new Razorpay({
    key_id: 'rzp_test_JVwXX3wTpMQa30',
    key_secret: 'soWXbCM772szYQdHd8IGGF0Q'
  })

  constructor() {
    super()
    this.intializeRoutes();
    this.authIntializeRoutes()
    
  }

  intializeRoutes() {
    this.adminRouter.get(this.userPath, this.jwtToken, this.adminToken, this.userAllList);
    this.loginRoute.post(this.registerPath, this.validation.authUser, this.userRegister);
    this.adminRouter.post('/user/' + this.params, this.jwtToken, this.adminToken, this.userDetails);
    // for user listing 
    this.adminRouter.get('/customerList' ,this.jwtToken, this.adminToken, this.customerListing )
    this.adminRouter.delete(this.userPath, this.jwtToken, this.adminToken, this.userUpdate);
    this.adminRouter.put(this.userPath + this.params, this.jwtToken, this.adminToken, this.validation.userUpdate, this.userUpdate);
    // add wallet / genrate order
    this.router.get('/addpayment', this.addWallet)
    this.adminRouter.get('/all-user', this.getAllUser)
    this.loginRoute.post('/delivery-boy-login-phone', this.validation.deliveryBoyuserLoginPassword, this.deliveryBoyuserLogin)

    this.loginRoute.post('/delivery-boy-login-email', this.validation.deliveryBoyLogin, this.deliveryBoyLogin)
    this.loginRoute.post('/vender-login', this.validation.venderLogin, this.venderLogin)
    this.loginRoute.post('/forget-password', this.validation.forGetPassword, this.forGetPassword)
    this.loginRoute.post('/password-change', this.validation.channge_password, this.userPasswordChange)
    this.loginRoute.post('/otp-verfiy', this.validation.otpVerfiy, this.otpVerfiy)
    // this.VenderRoute.get('/profile',this.venderProfile)

    // get numbers of total users
    // this.router.get('/total-user', this.totalUser)

    this.loginRoute.get('/user-profile',this.jwtToken,this.userProfile)
    this.loginRoute.get('/refer-and-earn',this.jwtToken,this.referAndEarn)

  }

  authIntializeRoutes() {
    this.loginRoute.post(this.loginPath, this.validation.userLogin, this.userLogin)
  }


  referAndEarn = async (req,res) =>{
    try {
      const data = await this.referModel.findOne({userId:req.userId});
      return res.status(200).json({data})
    } catch (error) {
      return res.status(500).json({error})
    }
  }


  userProfile = async(req,res)=>{
    try {
      const _id = req.userId;
      const data = await  this.authUserModel.findOne({_id:_id},);
      return res.status(200).json({data})
    } catch (error) {
      return res.status(200).json({error})
    }
  }

  customerListing = async (req,res)=>{
    try {
      let data = await this.authUserModel.aggregate([
        // { $match : {  user_type :1 } },
        // { $project: { userName: 1, email: 1 , phone :1 , dateJoined :1 } }
        { $match: { isStaff: false , isSuperuser : false , user_type : '1'  } },
        // { $project: { date: 1, item: 1 } }

      ]
      )
      return res.status(200).json({
        data
      })
    } catch (error) {
      return res.status(500).json({
        error:error
      })
    }
  }


  addWallet = async (rq, res) => {
    try {
      this.instance.orders.create({ amount: 1000, currency: 'INR', receipt: '1234885f', payment_capture: true, notes: 'cevjr' }).then((response) => {
        console.log("**********Order Created***********");
        console.log(response);
        console.log("**********Order Created***********");
        console.log(response.id);
        order_id = response.id;
      }).catch((error) => {
        console.log(error);
      })
      // instance.payments.capture(order_id, amount).then((response) => {
      //     console.log(response); 
      // }).catch((error) => {
      //   console.log(error);
      // }); 
      res.json(
        { order_id: order_id, amount: amount }
      );
    } catch (error) {
      res.send(error)
    }
  };

  userLogin = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        let payload = req.body;
        const user = await this.findByEmail(this.authUserModel, payload.email);
        this.userInfo['userId'] = user._id;
        this.userInfo['email'] = user.email;
        this.userInfo['role_admin'] = user.isSuperuser
        this.userInfo['role_isStaff'] = user.isStaff
        console.log(this.userInfo);
        const token = await this.jwt.sign(this.userInfo, this.JWT_SECREATE_kEY, { expiresIn: '86765m' });
        var refreshToken = this.randtoken.uid(256);
        console.log(user);
        refreshTokens[refreshToken] = user.email;
        res.status(200).json({
          accessToken: token,
          refreshToken: refreshToken
        })
      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  deliveryBoyuserLogin = async (req, res) => {
    try {
      console.log(req.body + "test");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const deliveryBoyUserInfo = {}
        let payload = req.body;
        console.log(payload);
        const user = await this.authUserModel.findOne({ phone: payload.phone })
        const check_user = await bcrypt.compare(payload.password,user.password);
       
        if(check_user == true){
          deliveryBoyUserInfo['userId'] = user._id;
          deliveryBoyUserInfo['email'] = user.email;
          deliveryBoyUserInfo['phone'] = user.phone;
          const token = await this.jwt.sign(deliveryBoyUserInfo, this.JWT_SECREATE_kEY, { expiresIn: '86765m' });
          var refreshToken = this.randtoken.uid(256);
          refreshTokens[refreshToken] = user.phone;
         return res.status(200).json({
            accessToken: token,
            refreshToken: refreshToken,
          });
        }
        else{
          return res.status(422).json({
            errors:[
              {
                value:payload.phone,
                "msg": "invalid user credentials",
                "param": "password",
                "location": "body"
              }
            ]
          
          });
        }
        // if (user) {
        //   deliveryBoyUserInfo['userId'] = user._id;
        //   deliveryBoyUserInfo['email'] = user.email;
        //   deliveryBoyUserInfo['phone'] = user.phone;
        //   const token = await this.jwt.sign(deliveryBoyUserInfo, this.JWT_SECREATE_kEY, { expiresIn: '86765m' });
        //   var refreshToken = this.randtoken.uid(256);
        //   refreshTokens[refreshToken] = user.phone;
        //  return res.status(200).json({
        //     accessToken: token,
        //     refreshToken: refreshToken,
        //     check_user
        //   });
        // }

      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  forGetPassword = async (req, res) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var error = { test: "invalid user info" }
        const payload = req.body;
        if (payload.user_type == 'vandor') {
          if (payload.forget_password_type == 'email') {

            const user = await this.authUserModel.findOne({ email: payload.email });

            if (user) {
              var otp = await createOtp()
              await this.authUserModel.updateOne({ email: payload.email }, { email_otp: otp })
              return res.status(200).json({ message: "otp send check email" + otp })
            }
            else {

              return res.status(500).json({ error })
            }
          }
          else if (payload.forget_password_type == 'phone') {
            var otp = await createOtp()
            await this.authUserModel.updateOne({ phone: payload.phone }, { mobile_otp: otp })
            console.log("uuuuuuuuuuuuuuuuu");
            return res.status(200).json({ message: "otp send check phone" + otp })
          }
          // const user = await this.findOne()
          return res.status(500).json({ error: 12 })
        }
        if (payload.user_type == 'delivery') {
          if (payload.forget_password_type == 'phone') {

            const user = await this.authUserModel.findOne({ phone: payload.phone });

            if (user) {
              console.log(user, "??????????????/");
              var otp = await createOtp()
              await this.authUserModel.updateOne({ phone: payload.phone }, { mobile_otp: otp })
              await send_otp.sendOtp(this.authUserModel, user._id)
              return res.status(200).json({ message: "otp send check phone :" + otp })
            }
            else {

              return res.status(500).json({ error })
            }
          }
          // const user = await this.findOne()
          return res.status(500).json({ error: 12 })
        }
        if (payload.user_type == 'user') {
          if (payload.forget_password_type == 'phone') {

            const user = await this.authUserModel.findOne({ phone: payload.phone });

            if (user) {
              console.log(user, "??????????????/");
              var otp = await createOtp()
              await this.authUserModel.updateOne({ phone: payload.phone }, { mobile_otp: otp })
              await send_otp.sendOtp(this.authUserModel, user._id)
              return res.status(200).json({ message: "otp send check phone :" + otp })
            }
            else {

              return res.status(500).json({ error })
            }
          }
          // const user = await this.findOne()
          return res.status(500).json({ error: 12 })
        }
      }
    } catch (error) {
      console.log(error, "kjhg");
      return res.status(500).json({ error })
    }
  }

  venderLogin = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const deliveryBoyUserInfo = {}
        let payload = req.body;
        const user = await this.authUserModel.findOne({ email: payload.email })
        if (user) {
          deliveryBoyUserInfo['userId'] = user._id;
          deliveryBoyUserInfo['email'] = user.email;
          deliveryBoyUserInfo['phone'] = user.phone;
          const token = await this.jwt.sign(deliveryBoyUserInfo, this.JWT_SECREATE_kEY, { expiresIn: '86765m' });
          var refreshToken = this.randtoken.uid(256);
          refreshTokens[refreshToken] = user.phone;
          return res.status(200).json({
            accessToken: token,
            refreshToken: refreshToken
          })
        }

        res.send("no")
      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  deliveryBoyLogin = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const deliveryBoyUserInfo = {}
        let payload = req.body;
        const user = await this.authUserModel.findOne({ phone: payload.phone })
        if (user) {
          deliveryBoyUserInfo['userId'] = user._id;
          deliveryBoyUserInfo['email'] = user.email;
          deliveryBoyUserInfo['phone'] = user.phone;
          const token = await this.jwt.sign(deliveryBoyUserInfo, this.JWT_SECREATE_kEY, { expiresIn: '86765m' });
          var refreshToken = this.randtoken.uid(256);
          refreshTokens[refreshToken] = user.phone;
          return res.status(200).json({
            accessToken: token,
            refreshToken: refreshToken
          })
        }

        res.send("no")
      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  userAllList = async (req, res) => {
    try {
      var querys = {};
      const { page, limit } = req.query;
      if (req.query.search) {
        let regex = new RegExp(`${req.query.search}`, "ig")
        querys['$or'] = [{ 'userName': regex }, { 'email': regex }]
      }
      if (!page && !limit) {
        var data = await this.allList(this.authUserModel, querys);
      }
      else {
        var options = {
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 1,
        };
        var data = await this.listPaginate(this.authUserModel, querys, options);
      }
      return res.status(200).json({ data: data })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  userDetails = async (req, res) => {
    try {
      var _id = req.params.id;
      const data = await this.findOne(this.authUserModel, _id);
      return res.status(200).json({ data: data })
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }
 
   generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = ' ';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
  
      return result;
  }
  
  // console.log(generateString(10));
  userRegister = async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        // const phone  = payload.phone.toString()
        // const check_phone = phone[11]
        // payload['phone'] = parseInt(check_phone)
        
        payload['isActive'] = false;
        let user = await this.add(this.authUserModel, payload)
        //  console.log(user)
       const newData = new this.referModel({
         userId:user._id,
         referCode:this.generateString(10),
       })
        await newData.save()
        return res.status(200).json({ message: "create account" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error })
    }
  }

  userUpdate = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var userId = req.userId;
        var _id = req.params.id
        let payload = req.body;
        let options = {
          isStaff: payload.isStaff,
          isSuperuser: payload.isSuperuser,
          isActive: payload.isActive
        }
        await this.updateOne(this.authUserModel, _id, options);
        return res.status(200).json({ message: "profile update" });
      }
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  }

  getAllUser = async (req, res) => {
    try {
      const data = await this.authUserModel.find({ user_type: 1 });
      return res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  userPasswordChange = async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        var error = { error: "invalid playload info" }
        const payload = req.body;
        console.log(payload, "????????????check");
        if (payload.user_type == 'vandor') {
          if (payload.forget_password_type == 'email') {

            const user = await this.authUserModel.findOne({ email: payload.email });
            if (user) {
              var password = await password_hash(payload.password)
              await this.authUserModel.updateOne({ email: payload.email }, { password })
              return res.status(200).json({ message: "verfiy email " })
            }
            else {

              return res.status(500).json({ error })
            }
          }
          else if (payload.forget_password_type == 'phone') {
            var password = await password_hash(payload.password)
            await this.authUserModel.updateOne({ phone: payload.phone }, { password })
            return res.status(200).json({ message: "verfiy phone" })
          }
          // const user = await this.findOne()
        }
        if (payload.user_type == 'delivery') {
          if (payload.forget_password_type == 'email') {
            const user = await this.authUserModel.findOne({ email: payload.email ,user_type:2});
            if (user) {
              var password = await password_hash(payload.password)
              await this.authUserModel.updateOne({ email: payload.email ,user_type:2}, { password })
              return res.status(200).json({ message: "successful password change " })
            }
            else {
              return res.status(500).json({ error })
            }
          }
         else if (payload.forget_password_type == 'phone') {
            const user = await this.authUserModel.findOne({ phone: payload.phone ,user_type:2});
            if (user) {
              var password = await password_hash(payload.password)
              await this.authUserModel.updateOne({ phone: payload.phone ,user_type:2}, { password })
              return res.status(200).json({ message: "successful password change " })
            }
            else {
              return res.status(500).json({ error })
            }
          }

        }
     
        if (payload.user_type == 'user') {
          if (payload.forget_password_type == 'email') {
            const user = await this.authUserModel.findOne({ email: payload.email ,user_type:1});
            if (user) {
              var password = await password_hash(payload.password)
              await this.authUserModel.updateOne({ email: payload.email ,user_type:1}, { password })
              return res.status(200).json({ message: "successful password change " })
            }
            else {
              return res.status(500).json({ error })
            }
          }
         else if (payload.forget_password_type == 'phone') {
            const user = await this.authUserModel.findOne({ phone: payload.phone ,user_type:1});
            if (user) {
              var password = await password_hash(payload.password)
              await this.authUserModel.updateOne({ phone: payload.phone ,user_type:1}, { password })
              return res.status(200).json({ message: "successful password change " })
            }
            else {
              return res.status(500).json({ error })
            }
          }

        }
        return res.status(500).json({ message:"invalid user info" })
      }
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  otpVerfiy = async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }
      else {
        const payload = req.body;
        console.log(req.body);
        if (payload.phone) {
          let match_value = { phone: payload.phone, mobile_otp: payload.mobile_otp }
          const data = await this.authUserModel.findOne(match_value)
          await this.authUserModel.findOneAndUpdate(match_value, { isActive: true }, { upsert: true })
          if (!data) {
            return res.status(422).json({ message: "invalid user" })
          }
          return res.status(200).json({ mobile_otp: data.mobile_otp })
        }
        else if (payload.email) {
          let match_value = { email: payload.email, email_otp: payload.email_otp }
          const data = await this.authUserModel.findOne(match_value)
          console.log(data, "vefiy");
          await this.authUserModel.findOneAndUpdate(match_value, { isActive: true }, { upsert: true })
          if (!data) {

            return res.status(422).json({ message: "invalid email" })
          }
          return res.status(200).json({ message: "verfiy otp", email_otp: data.email_otp })
        }
        return res.status(422).json({ message: "invalid user" })
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error })
    }
  }

}

module.exports = AuthUserController