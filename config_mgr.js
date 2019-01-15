//
// Created by freebsdk. 
//

var fs = require('fs');



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
    var obj = getValue(key);
    if(obj != null) {
        return JSON.parse(obj);
    }
    return null;
}






module.exports = {
    readConsoleParams : readConsoleParams,
    loadFromFile : loadFromFile,
    getString : getString,
    getNumber : getNumber,
    getJsonObj : getJsonObj
}
