const axios = require('axios')
exports.sendOtp = async (model,_id) => {
    return new Promise(async (res, rej) => {
        try {
            let user = await model.findOne({ _id:_id }).select('mobile_otp phone'); 
            console.log(user);
            let phone = user.phone
            let otp = user.mobile_otp
            
            let url = `https://2factor.in/API/V1/74c983bb-ee96-11ea-9fa5-0200cd936042/SMS/+91${phone}/${otp}`
            await axios.get(url);
            res({
                message: "otp send"
            })
        } catch (error) { 
            rej(error)
        }
    }) 
};
 


var otpcreate = async () =>{
    return Math.floor(10000 + Math.random() * 900000);
}


let createOtp =async (req,res) =>{
    return new Promise((resolve,reject)=>{
        var otp = otpcreate()
        var to_string = otp.toString;
        while(to_string.length ==6){
            var otp = otpcreate()
        }
        resolve(otp)
        
    })
}

exports.sendotpPhone = async (phone) => {
    return new Promise(async (res, rej) => {
        try {
            
            let otp = await createOtp()
            let url = `https://2factor.in/API/V1/74c983bb-ee96-11ea-9fa5-0200cd936042/SMS/+91${phone}/${otp}`
            await axios.get(url);
            res({
                message: "otp send",
                otp:otp
            })
        } catch (error) { 
            rej(error)
        }
    }) 
};
 