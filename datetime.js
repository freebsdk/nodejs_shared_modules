var getUnixTimeStampMsec = () => {
    return new Date().getTime();
}



var getUnixTimeStampSec = () => {
    return Math.floor(getUnixTimeStampMsec()/1000);
}



module.exports = {
    getUnixTimeStampMsec : getUnixTimeStampMsec,
    getUnixTimeStampSec : getUnixTimeStampSec
}