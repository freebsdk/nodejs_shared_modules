//
// Created by freebsdk. 
//

require('magic-globals');
var Moment = require('moment');
require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');





var IsUndefinedOrNull = (x) => {
    if(typeof x == 'undefined') return true;
    if(x == null) return true;

    return false;
}




var ValueWithFallback = (source_val, fallback_val) => {
    if(IsUndefinedOrNull(source_val)) {
        return fallback_val;
    }
    return source_val;
}





var Trace = (filename, line, msg) =>{
    var show_msg = "[TRACE] "+filename+" (line: "+line+")";
    if(IsUndefinedOrNull(msg) == false || msg.length < 1) {
        show_msg += " > "+msg;
    }
    console.error(show_msg);
}




var GetDateStr = () => {
    var dt = new Date();
    return Moment(dt).format('YYYY-MM-DD');
}





var GetTimeStr = () => {
    var dt = new Date();
    return Moment(dt).format('HH:mm:ss');
}





var GetDateTimeStr = () => {
    var dt = new Date();
    return Moment(dt).format('YYYY-MM-DD HH:mm:ss');
}




var TimeLog = (msg) => {
    var show_msg = "["+GetDateTimeStr()+"] "+msg;
    console.log(show_msg);
}




var TimeError = (filename, line, msg) => {
    var show_msg = "["+GetDateTimeStr()+"] "+filename+" (line:"+line+") "+msg;
    console.error(show_msg);
}





//os
var AsyncSleep = function(msec) {
    return new Promise((resolve) =>{
        setTimeout(()=>{
            resolve();
        }, msec);
    });
}



//os
var SyncSleep = function(msec) {
    if(msec <= 0) return;
    var st = new Date().getTime();
    for(;;) {
        dt = new Date().getTime() - st;
        if(dt >= msec) break;
    }
}




//network
var IsValidPort = (port) => {
    if(IsUndefinedOrNull(port)) return false;
    if(port >= 1 && port <= 65535) return true;
    return false;
}





//network
var IsPrivateIP = function(ip_str) {

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
var GetPrivateIPList = function() {
    var interfaces = os.networkInterfaces();
    var addresses = [];

    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                if(IsPrivateIP(address.address) == true) addresses.push(address.address);
            }
        }
    }

    return addresses;
}




function Seperate3Digit(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }



module.exports = {
    IsUndefinedOrNull : IsUndefinedOrNull,
    ValueWithFallback : ValueWithFallback,
    Seperate3Digit : Seperate3Digit,

    // console log
    Trace : Trace,
    TimeLog : TimeLog,
    TimeError : TimeError,

    // os
    AsyncSleep : AsyncSleep,
    SyncSleep : SyncSleep,
    
    // date
    GetDateStr : GetDateStr,
    GetTimeStr : GetTimeStr,
    GetDateTimeStr : GetDateTimeStr,

    // network
    IsValidPort : IsValidPort,
    IsPrivateIP : IsPrivateIP,
    GetPrivateIPList : GetPrivateIPList
}