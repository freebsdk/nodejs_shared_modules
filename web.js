var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var Util = require('./util.js');





global.app = express();






var initExpress = (register_packet_router_func) => {

    global.app.set('trust proxy', true); 
    global.app.use(bodyParser.json({limit: '5mb'}));
    global.app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    global.app.use(cookieParser());

	register_packet_router_func(global.app);

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









var OpenService = async(port, register_packet_router_func, private_key, cert, ca) => {

	initExpress(register_packet_router_func);	

	if(Util.IsNullOrEmpty(private_key) && Util.IsNullOrEmpty(cert) && Util.IsNullOrEmpty(ca)) {
		return await openHttpService(Number(port));
	}
	else {
		return await openHttpsService(Number(port), private_key, cert, ca);
	}
}






module.exports = {
	OpenService : OpenService
}
