window.getRanking = function(score, cb, src){
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.src += `?method=POST&callback=__cb__&score=${score}`;
    window.__cb__ = cb;
    document.body.appendChild(script);
}