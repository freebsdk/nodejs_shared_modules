var ConfigMgr = require('./config_mgr.js');




const DEFAULT_MYSQL_PORT = 3306;
const DEFAULT_CONNECTION_LIMIT = 5;



var Dsn = function() {
    this.database = "";
    this.host = "localhost";
    this.user = "";
    this.password = "";
    this.port = DEFAULT_MYSQL_PORT;
    this.connectionLimit = DEFAULT_CONNECTION_LIMIT;
}



var ConfigPropertyToDsn = (dbKey) => {
    var dsn = new Dsn();
    
    dsn.database = ConfigMgr.GetString("db::"+dbKey+"::database");
    dsn.host = ConfigMgr.GetString("db::"+dbKey+"::host");
    dsn.port = ConfigMgr.GetInt("db::"+dbKey+"::port");
    
    var user = ConfigMgr.GetInt("db::"+dbKey+"::user");
    if(user == null) dsn.user = ConfigMgr.GetString("db::common::user");
    else dsn.user = user;

    var password = ConfigMgr.GetInt("db::"+dbKey+"::password");
    if(password == null) dsn.password = ConfigMgr.GetString("db::common::password");
    else dsn.password = password;

    
    // Add optional parameters
    var connectionLimit = ConfigMgr.GetInt("db::"+dbKey+"::connectionLimit");
    if(connectionLimit != null) dsn["connectionLimit"] = connectionLimit;

    var connectTimeout = ConfigMgr.GetString("db::common::connectTimeout");
    if(connectTimeout != null) dsn["connectTimeout"] = connectTimeout;
        
    var multipleStatements = ConfigMgr.GetString("db::"+dbKey+"::multipleStatements");
    if(multipleStatements != null) dsn["multipleStatements"] = multipleStatements;
    
    var timezone = ConfigMgr.GetString("db::common::timezone");
    if(timezone != null) dsn["timezone"] = timezone;

    return dsn;
}




module.exports = {
    Dsn : Dsn,
    ConfigPropertyToDsn : ConfigPropertyToDsn    
}

