var getUnixTimeStampMsec = () => {
    return new Date().getTime();
}



var getUnixTimeStampSec = () => {
    return Math.floor(getUnixTimeStampMsec()/1000);
}




var getDateVal = function(date_obj) {

    if(typeof date_obj == 'undefined' || date_obj == null) {
        date_obj = new Date();
    }

    var y = date_obj.getFullYear().toString(); 

    var m = (date_obj.getMonth()+1).toString();
    if(m.length < 2) m = "0"+m;

    var d = (date_obj.getDate()).toString();
    if(d.length < 2) d = "0"+d;

    return y+m+d;
}


module.exports = {
    getUnixTimeStampMsec : getUnixTimeStampMsec,
    getUnixTimeStampSec : getUnixTimeStampSec,
    getDateVal : getDateVal
}