var ConfigMgr = require('./submodules/nodejs_shared_modules/config_mgr.js');
var Util = require('./submodules/nodejs_shared_modules/util.js');
var Web = require('./submodules/nodejs_shared_modules/web.js');

//routers
var GatewayRouter = require('./routers/gateway_router.js');





var readParameters = () => {
    var argv = ConfigMgr.LoadConsoleParamsIntoConfig();
    if(Util.IsNullOrEmpty(argv) || argv.length != 2) {
        console.error("[!] Please specify parameter.");
        console.error("$ process [port] [/path/to/config]");
        process.exit(-1);
    }

    var res = ConfigMgr.LoadFromFile(argv[1]);
    if(res.error != "ok") {
        Util.Trace(__filename, __line);
        process.exit(-2);
    }

    return argv;
}




var registerPacketRouter = (app) => {
	app.use('/static', express.static('public'));
    app.use('/gateway', GatewayRouter.router);
}




var main = async() => {
    var argv = readParameters();
    await Web.OpenService(argv[0], registerPacketRouter);
}




main();
