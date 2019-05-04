var Mysql = require('mysql');
var Util = require('./util.js');




global.dbhPool = {};





var Open = (dsn) => {

    var handle = global.dbhPool[dsn.database];
    if(!Util.IsNullOrEmpty(handle)) {
        console.error("[!] Already registered db key : "+dbKey);
        return { error : "duplicate_db_key" };
    }

    try {
        var dbh = Mysql.createPool(dsn);
        global.dbhPool[dsn.database] = dbh;
    }
    catch(error) {
        console.error(error);
        return { error : 'db_connect_fail' }
    }
    
    return { error : "ok" }
}





var Exec = (dbKey, query, value) => {
    return new Promise((resolve, reject) => {
        var the_pool = global.dbhPool[dbKey];
        if(typeof the_pool == 'undefined') {
            reject({error : 'not_exist_handle'});
            return;
        }

        the_pool.getConnection((err, connection) => {
            if(err != null) {
                Util.TimeError(__filename, __line, err);
                reject({error : err});
                return;
            }
            else {
                connection.query(query, value, (err, rows) => {
                    if(err != null) {
                        Util.TimeError(__filename, __line, err);
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
    Open : Open,
    Exec : Exec
}
