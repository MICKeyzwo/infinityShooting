window.touchLogger = (function(){
    let touch = [];
    window.addEventListener("touchstarat", touching);
    window.addEventListener("touchmove", touching);
    window.addEventListener("touchend", touching);
    function touching(e){
        touch = [];
        var rect = e.target.getBoundingClientRect();
        var th = e.touches;
        for (var i = 0; i < th.length; i++) {
            touch.push([
                e.target.width * (e.clientX - rect.x) / e.target.clientWidth,
                e.target.height * (e.clientY - rect.y) / e.target.clientHeight
            ]);
        }
    }
    return {
        isFire: function(){
            for (var i = 0; i < touch.length; i++) {
                
            }
        }
    }
})();