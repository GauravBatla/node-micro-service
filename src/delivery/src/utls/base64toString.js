'use strict';

const fs = require('fs');

let convertImage = (data,fileName) =>{
    return new Promise((resolve,reject)=>{
        let buff = new Buffer.from(data, 'base64');
        let file = fileName+"_"+Date.now()+".png"
        fs.writeFileSync('upload/'+file, buff);
        resolve(file)
    })
}

                    
module.exports ={
    base64toImage:convertImage
};


