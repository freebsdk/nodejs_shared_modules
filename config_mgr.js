//
// Created by freebsdk. 
//

var fs = require('fs');
var MySQLMgr = require('./mysql_mgr.js');
var Util = require('./util.js');



global.config = {};
global.argv = {};




var readConsoleParams = () => {
    global.argv = process.argv.slice(2);
}




var loadFromFile = (path) => {
    try {
        var data = fs.readFileSync(path,'utf8');
        global.config = JSON.parse(data);
    }
    catch(err) {
        if(err.code === 'ENOENT') {
            return { error : "file_not_found" }
        }
        else {
            return { error : "invalid_cfg_context" }
        }        
    }

    return { error : "ok" };
}





var getString = (key) => {
    try {
        var res = global.config[key];
        if(typeof res == 'undefined') return null;
    }
    catch(err) {
        return null;
    }
    return res;
}




var getNumber = (key) => {
    var str = getString(key);
    if(str != null) return Number(str);
    
    return null;
}





var getJsonObj = (key) => {
    var obj = getString(key);
    if(obj != null) {
        return JSON.parse(obj);
    }
    return null;
}






var getValue = (key) => {
    return global.config[key];
}






var initDBPool = (dsn_key) => {
    var dsn = getValue(dsn_key);
    
    try {
        MySQLMgr.open(dsn);
    }
    catch(error) {
        console.error(error);
        process.exit(-2);
    }
}





var loadConfigFromDB = async() => {
    var records = await MySQLMgr.exec("upbit_autotrade", "SELECT keyname,`value` FROM tbl_common_cfg", []);

    for(var i=0; i<records.rows.length;i++) {
        var record = records.rows[i];
        
        // Do not replace properties from the config file.
        if(Util.isNullOrEmpty(global.config[record.keyname])) {
            global.config[record.keyname] = record.value;
        }
    }
}




module.exports = {
    
    getString : getString,
    getNumber : getNumber,
    getJsonObj : getJsonObj,
    getValue : getValue,
    initDBPool : initDBPool,
    
    readConsoleParams : readConsoleParams,
    loadFromFile : loadFromFile,
    loadConfigFromDB : loadConfigFromDB
}
