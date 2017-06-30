window.getScript = function(src){
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    document.body.appendChild(script).parentNode.removeChild(script);
}