bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

    
let matchPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        authUserModel.findOne({ email: email, isActive: true }, function (err, user) {
            if (err) {
                reject(err)
            }
            else {
                if (!user) {
                    reject(err)
                    console.log(user, "::::::::::::::::::::::::::::");
                }
                else {

                    // test a matching password
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) {
                            reject(err)
                        }
                        resolve(isMatch)
                        // if(isMatch === false){
                        //     reject(isMatch)
                        //     console.log('Password123:', isMatch); // -&gt; Password123: true
                        // }
                    });
                }
            }
        });
    })
}

var otpcreate = async () =>{
    return Math.floor(10000 + Math.random() * 900000);
}


module.exports ={
    password_hash: async(value) =>{
       return new Promise((resolve,reject)=>{
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return reject(err);
            // hash the password using our new salt
            bcrypt.hash(value, salt, function (err, hash) {
                if (err) return reject(err);
                // override the cleartext password with the hashed one
                 resolve(hash)
            });
        });
       })
    },
    createOtp:async (req,res) =>{
        return new Promise((resolve,reject)=>{
            var otp = otpcreate()
            var to_string = otp.toString;
            while(to_string.length ==6){
                var otp = otpcreate()
            }
            resolve(otp)
            
        })
    }
}


