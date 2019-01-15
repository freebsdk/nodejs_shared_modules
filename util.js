require('magic-globals');
require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');





var isNullOrEmpty = (x) => {
    if(typeof x == 'undefined') return true;
    if(x == null) return true;
    if(x.length == 0) return true;

    return false;
}




var valueWithFallback = (source_val, fallback_val) => {
    if(isNullOrEmpty(source_val)) {
        return fallback_val;
    }
    return source_val;
}








var trace = (filename, line, msg) =>{
    var show_msg = "[TRACE] "+filename+" (line: "+line+")";
    if(isNullOrEmpty(msg) == false) {
        show_msg += " > "+msg;
    }
    Console.error(show_msg);
}



//os
var asyncSleep = function(msec) {
    return new Promise((resolve) =>{
        setTimeout(()=>{
            resolve();
        }, msec);
    });
}



//os
var syncSleep = function(msec) {
    if(msec <= 0) return;
    var st = new Date().getTime();
    for(;;) {
        dt = new Date().getTime() - st;
        if(dt >= msec) break;
    }
}




//network
var isValidPort = (port) => {
    if(port >= 1 && port <= 65535) return true;
    return false;
}





//network
var isPrivateIP = function(ip_str) {

    var tok = ip_str.split(".");
    if(tok.length != 4) return false;

    if(tok[0] == 10)
    {
        if( tok[1] >= 0 && tok[1] <= 255 &&
            tok[2] >= 0 && tok[2] <= 255 &&
            tok[3] >= 0 && tok[3] <= 255) return true;
    }
    else if(tok[0] == 172)
    {
        if( tok[1] >= 16 && tok[1] <= 31 &&
            tok[2] >= 0  && tok[2] <= 255 &&
            tok[3] >= 0  && tok[3] <= 255) return true;
    }
    else if(tok[0] == 192)
    {
        if( tok[1] == 168 &&
            tok[2] >= 0   && tok[2] <= 255 &&
            tok[3] >= 0   && tok[3] <= 255) return true;
    }

    return false;
}




//network
var getPrivateIPList = function() {
    var interfaces = os.networkInterfaces();
    var addresses = [];

    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                if(isPrivateIP(address.address) == true) addresses.push(address.address);
            }
        }
    }

    return addresses;
}





module.exports = {
    isNullOrEmpty : isNullOrEmpty,
    valueWithFallback : valueWithFallback,
    trace : trace,

    //os
    asyncSleep : asyncSleep,
    syncSleep : syncSleep,
    
    //network
    isValidPort : isValidPort,
    isPrivateIP : isPrivateIP,
    getPrivateIPList : getPrivateIPList
}