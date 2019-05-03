//
// Created by freebsdk. 
//

var Mysql = require('mysql');
var ConfigMgr = require('./config_mgr.js');
var Util = require('./util.js');



const DEFAULT_MYSQL_PORT = 3306;
const DEFAULT_CONNECTION_LIMIT = 5;




global.dbh_pool = {};



var open = (dsn) => {

    //optional parameters
    if(!Util.isNullOrEmpty(dsn.connectionTimeout)) {
        dsn['connectTimeout'] = dsn.connectionTimeout;
    }

    if(!Util.isNullOrEmpty(dsn.multipleStatement)) {
        dsn['multipleStatements'] = dsn.multipleStatement;
    }

    if(Util.isNullOrEmpty(dsn.timezone) == false) {
        dsn['timezone'] = dsn.timezone;
    }

    try {
        var dbh = Mysql.createPool(dsn);
    }
    catch(error) {
        console.error(error);
        return { error : 'db_connect_fail' }
    }
    
    global.dbh_pool[dsn.database] = dbh;

    return { error : "ok" }
}





var exec = (db_key, query, value) => {
    return new Promise((resolve, reject) => {
        var the_pool = global.dbh_pool[db_key];
        if(typeof the_pool == 'undefined') {
            reject({error : 'not_exist_handle'});
            return;
        }

        the_pool.getConnection((err, connection) => {
            if(err != null) {
                Util.timeError(__filename, __line, err);
                reject({error : err});
                return;
            }
            else {
                connection.query(query, value, (err, rows) => {
                    if(err != null) {
                        Util.timeError(__filename, __line, err);
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
