var fs = require('fs');
var DbContextMgr = require('./mysql_mgr.js');
var Util = require('./util.js');



global.config = {};




var LoadConsoleParamsIntoConfig = () => {
    var argv = process.argv.slice(2);
    global.config["argv"] = argv;
    
    return argv;
}




var LoadFromFile = (path) => {
    try {
        var data = fs.readFileSync(path,'utf8');
        var fileConfig = JSON.parse(data); 

        for(var key in fileConfig) {
            global.config[key] = fileConfig[key];
        }
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






var InitDBPool = (dsnKey) => {
    var dsn = GetValue(dsnKey);
    if(typeof dsn == 'undefined') {
        console.error("Not defined config property : "+dsnKey);
        process.exit(-1);
    }

    try {
        DbContextMgr.Open(dsn);
    }
    catch(error) {
        console.error(error);
        process.exit(-2);
    }
}





var LoadConfigFromDBAsync = async(configDbName) => {
    var records = await DbContextMgr.Exec(configDbName, "SELECT cfg_key,cfg_val FROM tbl_common_config", []);

    for(var i=0; i<records.rows.length;i++) {
        var record = records.rows[i];
        
        // Do not replace exist properties from the config file.
        if(Util.IsNullOrEmpty(global.config[record.cfg_key])) {
            global.config[record.cfg_key] = record.cfg_val;
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
    
    LoadConsoleParamsIntoConfig : LoadConsoleParamsIntoConfig,
    LoadFromFile : LoadFromFile,
    LoadConfigFromDBAsync : LoadConfigFromDBAsync
}
