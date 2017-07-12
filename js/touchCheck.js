window.isTouchable = (() => {
    var ua = navigator.userAgent;
    return (ua.indexOf("iPhone") >= 0 ||
            ua.indexOf("iPod") >= 0 ||
            ua.indexOf("iPad") >= 0 ||
            ua.indexOf("Android") >= 0 ||
            ua.indexOf("Mobile") >= 0
            );
})()