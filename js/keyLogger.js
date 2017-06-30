window.keyLogger = (function(){
    let key = {}
    window.addEventListener("keydown", e => {
        key[e.key] = true;
    });
    window.addEventListener("keyup", e => {
        key[e.key] = false;
    });
    return {
        isDown: function(k){
            return !!key[k];
        },
        isUp: function(k){
            return !key[k];
        },
        someDown(){
            for(var i in key){
                if(!!key[i]) return true;
            }
            return false;
        }
    }
})()