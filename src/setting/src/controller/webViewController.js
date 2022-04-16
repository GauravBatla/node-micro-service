const express = require('express');
const { validationResult } = require('express-validator')
const validations = require('../utls/validations');
const { models } = require('../../../database/index')
class WebViewController {
    router = express.Router()
    webViewModel = models.webViewPageModel;

    constructor() {
        this.intializeRoutes()
     }
    intializeRoutes() { 
        this.router.post('/add-web-views',validations.addWebView,this.addView);
        this.router.put('/add-web-views/:id',validations.updateaddWebView,this.updateaddView);
        this.router.get('/add-web-views/:id',this.getaddView);
        this.router.get('/add-web-views',this.getalladdView);
    }

    addView = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const payload = req.body;
                const newdata = new this.webViewModel(payload);
                await newdata.save();
                return res.status(200).json({message:"create web view page "+payload.title})
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    getaddView = async (req, res) => {
        try {
              const _id = req.params.id;
                // if(!_id){
                // }
                var data = await this.webViewModel.findOne({title:req.params.id})
                // var data = await this.webViewModel.find()
                return res.status(200).json({data:data})
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    getalladdView = async (req, res) => {
        try {
             
                var data = await this.webViewModel.find()
                return res.status(200).json({data:data})
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    updateaddView = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const payload = req.body;
                await this.webViewModel.findOneAndUpdate({title:req.params.id},payload)
                return res.status(200).json({message:"create web view page "+payload.title})
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
    
}

module.exports = {
    WebViewController
}