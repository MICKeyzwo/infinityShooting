getScript("js/mediaLoader.js");
getScript("js/entyties.js");
getScript("js/keyLogger.js");

window.addEventListener("load", () => {
    
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const WIDTH = canvas.width = 400;
    const HEIGHT = canvas.height = 600;
    canvas.addEventListener("mousedown", e => e.preventDefault());
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "40px bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("now loading...", WIDTH / 2, HEIGHT / 2);
    ctx.restore();

    let image = {};
    let ent = {};

    function prepare(){
        let ml = MediaLoader.create();
        ml.loadImage({
            back: "img/back.png",
            player: "img/player.png",
            ammo: "img/ammo.png",
            coin: "img/coin.png"
        }, setEntyties, image);
        function setEntyties(source){
            window._setEntyties(source, ctx, ent);
            gemeMain();
        }
    }

    function gemeMain(){

        let state = 0;
        let frame = 0;
        let timer = setInterval(tick, 1000 / 30);

        let player = new ent.Player(WIDTH / 2, HEIGHT - 100);
        let fireLast = false;
        let fireInt = 0;
        let plAmmo = [];
        let enemy = [];
        let enAmmo = [];
        let ruins = [];

        function tick(){
            update();
            draw();
            frame++;
        }

        function update(){
            if(state === 0){
                if(keyLogger.someDown()) state = 1;
                fireInt = 10;
            }else if(state === 1){
                let vx = 0, vy = 0;
                if(keyLogger.isDown("ArrowRight")) vx += 7;
                if(keyLogger.isDown("ArrowLeft")) vx -= 7;
                if(keyLogger.isDown("ArrowUp")) vy -= 7;
                if(keyLogger.isDown("ArrowDown")) vy += 7;
                if(keyLogger.isDown(" ") && fireInt === 0 && plAmmo.length < 5){
                    plAmmo.push(new ent.Ammo(player.x, player.y));
                    fireInt = 10;
                }
                if(keyLogger.isUp(" ")) fireInt = 0; else fireInt--;
                player.move(vx, vy);
                for(var i = 0; i < plAmmo.length; i++){
                    plAmmo[i].move();
                    if(plAmmo[i].y < -10){
                        plAmmo.splice(i, 1);
                        i--;
                    }
                }
            }else if(state === 2){

            }
        }

        function draw(){
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            drawBack();

            player.draw();

            for(var i = 0; i < plAmmo.length; i++){
                plAmmo[i].draw();
            }

            if(state === 0){
                drawMenu();
            }
        }

        function drawBack(){
            ctx.drawImage(image.back, 0, 0, WIDTH, HEIGHT, 0, frame % HEIGHT, WIDTH, HEIGHT);
            ctx.drawImage(image.back, 0, 0, WIDTH, HEIGHT, 0, -HEIGHT + frame % HEIGHT + 10, WIDTH, HEIGHT);
        }

        function drawCont(){

        }

        function drawMenu(){
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "50px bold";
            ctx.globalAlpha = 0.8;
            ctx.fillText("Push to start", WIDTH / 2, HEIGHT / 2);
            ctx.strokeText("Push to start", WIDTH / 2, HEIGHT / 2);
            ctx.restore();
        }

    }

    prepare();

});
