const express = require('express');
const {validationResult} = require('express-validator')
const validation = require('../utls/validations');
const {models} = require('../../../database/index')
class BannerController {
    router = express.Router();
    bannerModel =models.bannerModel
    constructor() {
   this.intializeRoutes()
    }
    intializeRoutes() {
        this.router.post('/add',validation.bannerAdd,this.addBanner);
        this.router.get('/banner',this.getBanner)
        this.router.put('/banner/:id',this.updateBanner)
        this.router.delete('/banner/:id',this.updateBanner)
    }
    async addBanner(req, res) {
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
                const newData = new this.bannerModel(payload);
                await newData.save()
                return res.status(200).json({message:"upload images"})
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    async getBanner(req,res){
        try {
            const data = await this.bannerModel.find();

            return res.status(200).json({data})
        } catch (error) {
            return res.status(500).json({error})
        }
    }
    async updateBanner(req,res){
        try {
            const _id = req.params.id;
           const payload = req.body
            const data = await this.bannerModel.findOne({_id},payload);
            return res.status(200).json({data})
        } catch (error) {
            return res.status(500).json({error})
        }
    }
    async deleteBanner(req,res){
        try {
            const _id = req.params.id;
            const data = await this.bannerModel.deleteOne({_id});
            return res.status(200).json({data})
        } catch (error) {
            return res.status(500).json({error})
        }
    }
}

module.exports = {
    BannerController
}