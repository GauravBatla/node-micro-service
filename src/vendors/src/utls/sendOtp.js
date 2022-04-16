const axios = require("axios");
// const client = require('twilio')("AC909e5a8694df11570fa4b93f55751e2c", "b2398ac1cb23776ddf45853ebd13339d");

// exports.sendSms = async (otp) =>{
//   return new Promise(async(resolve,reject)=>{
//       try {
//             client.messages.create({
//             body: 'This is the ship that made the Kessel Run in fourteen parsecs?'+otp,
//             from: '+15407923554',
//             to: '+919675004434'
//         })
//         .then(message => resolve(message)).catch(err=>reject(err))
//       } catch (error) {
//           reject(error)
//       }
//   })

// }
// const client = require('twilio')("AC909e5a8694df11570fa4b93f55751e2c", "b2398ac1cb23776ddf45853ebd13339d");
const apikey = process.env.Api_Key;
const senderid = process.env.Sender_Id;

exports.sendSms = async (otp, number) => {
    try {
        let params = await {
            apikey,
            senderid,
            number,
            message: `Your one time OTP is ${otp.toString()} Please don't share it. SKND`,
            format: "json",
        };
        let response = await axios.get(`http://sms.osdigital.in/V2/http-api.php`, { params });
        console.log(response.data)
        if (response.data.status === "OK") {
            return true;
        }
        return false;
    } catch (error) {
        return error;
    }
};


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
