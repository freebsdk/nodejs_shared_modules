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





var trace = (filename, line, err) => {

    var msg = "["+filename+"] (line:"+line+") ";
    if(!isNullOrEmpty(err)) {
        msg += "> "+err;
    }

    console.error(err);
}




module.exports = {
    isNullOrEmpty : isNullOrEmpty,
    valueWithFallback : valueWithFallback,
    trace : trace
}