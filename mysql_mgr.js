//
// Created by freebsdk. 
//

var Mysql = require('mysql');
var ConfigMgr = require('./config_mgr.js');
var Util = require('./util.js');



const DEFAULT_MYSQL_PORT = 3306;
const DEFAULT_CONNECTION_LIMIT = 5;




var dbh_pool = {};





var open = (db_key) => {

    var cfg_info = ConfigMgr.getJsonObj(db_key);
    if(cfg_info == null) return { error : "not_exist_cfg" };

    if(isNullOrEmpty(cfg_info.host)) return { error : "not_exist_cfg" };
    if(isNullOrEmpty(cfg_info.user)) return { error : "not_exist_cfg" };
    if(isNullOrEmpty(cfg_info.password)) return { error : "not_exist_cfg" };
    
    var set_cfg = {};
    set_cfg['database'] = db_key;
    set_cfg['host'] = cfg_info.host; 
    set_cfg['user'] = cfg_info.user;
    set_cfg['password'] = cfg_info.password;
    set_cfg['port'] = (util.isNullOrEmpty(cfg_info.port)) ? DEFAULT_MYSQL_PORT : Number(cfg_info.port);
    set_cfg['connectionLimit'] = (util.isNullOrEmpty(cfg_info.connection_limit)) ? DEFAULT_CONNECTION_LIMIT : Number(cfg_info.connection_limit);

    //optional parameters
    if(Util.isNullOrEmpty(cfg_info.connection_timeout) == false) {
        set_cfg['connectTimeout'] = cfg_info.connection_timeout;
    }

    if(Util.isNullOrEmpty(cfg_info.multiple_statement) == false) {
        set_cfg['multipleStatements'] = cfg_info.multiple_statement;
    }

    if(Util.isNullOrEmpty(cfg_info.timezone) == false) {
        set_cfg['timezone'] = cfg_info.timezone;
    }

    var dbh = Mysql.createPool(set_cfg);
    dbh_pool[db_key] = dbh;

    return { error : "ok" }
}





var exec = (db_key, query, value) => {
    return new Promise((resolve, reject) => {
        var the_handle = dbh_pool[db_key];
        if(typeof the_handle == 'undefined') {
            reject({error : 'not_exist_handle'});
            return;
        }

        the_pool.getConnection((err, connection) => {
            if(err != null) {
                util_mod.trace(__filename, __line, err);
                reject({error : err});
                return;
            }
            else {
                connection.query(query, value, (err, rows) => {
                    if(err != null) {
                        util_mod.trace(__filename, __line, err);
                        reject({error :err});
                        return;
                    }
                    else {
                        connection.release();
                        resolve({error : "ok", rows: rows});
                        return;
                    }
                });
            }
        });
    }).catch((error) => {
        return { error : error };
    });
}




module.exports = {
    open : open,
    exec : exec
}
