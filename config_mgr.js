//
// Created by freebsdk. 
//

var fs = require('fs');
var MySQLMgr = require('./mysql_mgr.js');
var Util = require('./util.js');



global.config = {};
global.argv = {};




var ReadConsoleParams = () => {
    global.argv = process.argv.slice(2);
}




var LoadFromFile = (path) => {
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





var GetString = (key) => {
    try {
        var res = global.config[key];
        if(typeof res == 'undefined') return null;
    }
    catch(err) {
        return null;
    }
    return res;
}




var GetInt = (key) => {
    var str = GetString(key);
    if(str != null) return parseInt(str);
    
    return null;
}





var GetFloat = (key) => {
    var str = GetString(key);
    if(str != null) return parseFloat(str);
    
    return null;
}






var GetJsonObj = (key) => {
    var obj = GetString(key);
    if(obj != null) {
        return JSON.parse(obj);
    }
    return null;
}






var GetValue = (key) => {
    return global.config[key];
}






var InitDBPool = (dsn_key) => {
    var dsn = GetValue(dsn_key);
    if(typeof dsn == 'undefined') {
        console.error("Not defined config property : "+dsn_key);
        process.exit(-2);
    }

    try {
        MySQLMgr.open(dsn);
    }
    catch(error) {
        console.error(error);
        process.exit(-2);
    }
}





var LoadConfigFromDB = async(config_db_name) => {
    var records = await MySQLMgr.exec(config_db_name, "SELECT keyname,`value` FROM tbl_common_cfg", []);

    for(var i=0; i<records.rows.length;i++) {
        var record = records.rows[i];
        
        // Do not replace properties from the config file.
        if(Util.isNullOrEmpty(global.config[record.keyname])) {
            global.config[record.keyname] = record.value;
        }
    }
}




module.exports = {
    
    GetString : GetString,
    GetInt : GetInt,
    GetFloat : GetFloat,
    GetJsonObj : GetJsonObj,
    GetValue : GetValue,
    InitDBPool : InitDBPool,
    
    ReadConsoleParams : ReadConsoleParams,
    LoadFromFile : LoadFromFile,
    LoadConfigFromDB : LoadConfigFromDB
}
