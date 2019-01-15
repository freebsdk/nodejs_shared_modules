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





var isValidPort = (port) => {
    if(port >= 1 && port <= 65535) return true;
    return false;
}




var trace = (filename, line, msg) =>{
    var show_msg = "[TRACE] "+filename+" (line: "+line+")";
    if(isNullOrEmpty(msg) == false) {
        show_msg += " > "+msg;
    }
    Console.error(show_msg);
}



module.exports = {
    isNullOrEmpty : isNullOrEmpty,
    valueWithFallback : valueWithFallback,
    isValidPort : isValidPort,
    trace : trace
}