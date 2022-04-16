const gateway = require('fast-gateway');
const {router} = require('./mico.services');
require('dotenv').config()

const server = gateway({
    routes: router
});

const localtunnel = require('localtunnel');

const tunnel = localtunnel(process.env.port,)




//lt --port 3000
server.start(process.env.port).then(data => {
    console.log("/api getway : " + process.env.port);
});



