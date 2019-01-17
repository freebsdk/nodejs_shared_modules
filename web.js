const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const util = require('./util.js');





global.app = express();






var initExpress = (register_packet_router_func) => {

    global.app.set('trust proxy', true); 
    global.app.use(bodyParser.json({limit: '5mb'}));
    global.app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    global.app.use(cookieParser());

	register_packet_router_func();

    //404 handler
    global.app.use(function (req, res, next) {
        console.error('[404] (not defined router?) :' + req.url);
        res.status(404).send('[404] (not defined router?)');
    });

    //500 handler
    global.app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('[500] error.');
    });
}







var openHttpsService = (port, private_key, cert, ca) => {
	return new Promise((resolve, reject) => {
    	var options = {
        	key     : private_key,
        	cert    : cert,
        	ca      : ca,
        	rejectUnauthorized: false
    	}

    	var service = https.createServer(options, global.app).listen(port, function () {
        	console.log('[!] Web service listening on port (ssl) : ' + port);
			resolve();
    	});
	});
}








var openHttpService = (port) => {
	return new Promise((resolve, reject) => {
        var service = global.app.listen(port, function () {
            console.log('[!] Web service listening on port : ' + port);
			resolve();
        });		
	});
}









var openService = async(port, register_packet_router_func, private_key, cert, ca) => {

	initExpress(register_packet_router_func);	

	if(util.isNotNull(private_key) && util.isNotNull(cert) && util.isNotNull(ca)) {
		return await openHttpsService(port, private_key, cert, ca);
	}
	else {
		return await openHttpService(port);
	}
}






module.exports = {
	openService : openService
}
