window.MediaLoader = (() => {
    function Video() {return document.createElement("Video")}
    function load(src, cb, ref, type){
        if(typeof src !== "object") {console.log("illegal argument.\nplease throw srcs with object."); return;}
        if(typeof cb !== "function") {console.log("illegal argument.\nplease throw callback with function."); return;}
        let done = {};
        let res = {};
        for(let i in src){
            done[i] = false;
            res[i] = new type();
        }
        for(let i in src){
            res[i].src = src[i];
            res[i].addEventListener("load", (e) => {
                done[i] = true;
                let end = true;
                for(let j in src){
                    if(!done[j]) {end = false; break}
                }
                if(end){
                    if(typeof ref === "object") Object.assign(ref, res);
                    cb(res);
                }
            });
        }
    }
    let proto = {
        loadImage: function(src, cb, ref){
            load(src, cb, ref, Image);
        },
        loadAudio: function(src, cb, ref){
            load(src, cb, ref, Audio);
        },
        loadVideo: function(src, cb, ref){
            load(src, cb, ref, Video);
        }
    };
    function create(){
        return Object.create(proto);
    }
    return {create};
})();
