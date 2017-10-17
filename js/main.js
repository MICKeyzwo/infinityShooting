getScript("js/mediaLoader.js");
getScript("js/entyties.js");
getScript("js/keyLogger.js");
getScript("js/ajax.js");
getScript("js/searchQuery.js");
getScript("js/deviceCheck.js");

window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const WIDTH = canvas.width = 400;
    const HEIGHT = canvas.height = 600;
    const RANKING_URL = "https://script.google.com/macros/s/AKfycbyMp5QG2P35m0krgaa0R1YIBvRwoZsFs3jFuGpjeaCdTV3COnAt/exec";
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

    function prepare() {
        let ml = MediaLoader.create();
        ml.loadImage({
            back: "img/back.png",
            backt: "img/backt.png",
            player: "img/player.png",
            explosion: "img/explosion.png",
            ammo: "img/ammo.png",
            eammo: "img/eammo.png",
            debri: "img/debri.png",
            coin: "img/coin.png",
            kamikaze: "img/kamikaze.png",
            turner: "img/turner.png",
        }, setEntyties, image);
        function setEntyties(source) {
            window._setEntyties(source, ctx, ent);
            gemeMain();
        }
    }

    function gemeMain() {

        let state = 0;
        let frame = 0;
        let gameFrame = 0;
        let timer = setInterval(tick, 1000 / 30);

        let somePushed = false;
        let gameOverd = 0;

        let score = 0;

        let player = new ent.Player(WIDTH / 2, HEIGHT - 100);
        let fireLast = false;
        let fireInt = 0;
        let rankFlg = 0;
        let rankValue;

        let plAmmo = [];
        let enemy = [];
        let enAmmo = [];
        let debris = [];

        function tick() {
            update();
            draw();
            frame++;
        }

        function update() {
            if (somePushed && !keyLogger.someDown()) somePushed = false;
            if (state === 0) {
                if (keyLogger.someDown() && !somePushed) {
                    state = 1;
                    fireInt = 10;
                    gameFrame = 0;
                    if(searchQuery.immotal) player.exist = false;
                }
            } else if (state === 1) {
                let vx = 0, vy = 0;
                if (keyLogger.isDown("ArrowRight")) vx += 7;
                if (keyLogger.isDown("ArrowLeft")) vx -= 7;
                if (keyLogger.isDown("ArrowUp")) vy -= 7;
                if (keyLogger.isDown("ArrowDown")) vy += 7;
                if (keyLogger.isDown(" ") && fireInt === 0 &&
                    ((!searchQuery.rapid && plAmmo.length < 5) || searchQuery.rapid)) {
                    plAmmo.push(new ent.Ammo(player.x, player.y));
                    if(!searchQuery.rapid) fireInt = 10;
                }
                if (keyLogger.isUp(" ")) fireInt = 0; else if(fireInt > 0) fireInt--;
                player.move(vx, vy);
                let flg = (Math.random() * (!searchQuery.hell ? (30 - (gameFrame / 33) / 20) : 5)) | 0;
                //let flg = (Math.random() * 25) | 0;
                if (flg < 0) flg = 0;
                if (flg === 0) {
                    pat = (Math.random() * 10) | 0;
                    if (pat < 5) enemy.push(new ent.Coin(player));
                    else if (pat < 8) enemy.push(new ent.Turner(player));
                    else enemy.push(new ent.Kamikaze(player));
                }

                gameFrame++;
            } else if (state === 2) {
                if (rankFlg === 0 && !searchQuery.rapid && !searchQuery.hell && !searchQuery.immotal && !searchQuery.local) {
                    getRanking(score, json => {
                        rankValue = json;
                        if (rankFlg === 1) rankFlg = 2; else rankFlg = 0;
                    }, RANKING_URL);
                    rankFlg = 1;
                }
                if (gameOverd <= 0 && keyLogger.someDown()) {
                    somePushed = true;
                    player.x = WIDTH / 2;
                    player.y = HEIGHT - 100;
                    player.exist = true;
                    player.expFrame = 0;
                    plAmmo = [];
                    enemy = [];
                    enAmmo = [];
                    debris = [];
                    score = 0;
                    rankFlg = 0;
                    state = 0;
                }
                if (gameOverd > 0) gameOverd--;
            }
            for (var i = 0; i < plAmmo.length; i++) {
                plAmmo[i].move();
                if (plAmmo[i].y < -10) {
                    plAmmo.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < enemy.length; i++) {
                enemy[i].update(player);
            }
            for (var i = 0; i < debris.length; i++) {
                if (!debris[i].update()) {
                    debris.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < enAmmo.length; i++) {
                enAmmo[i].move();
                if (enAmmo[i].outStage()) {
                    enAmmo.splice(i, 1);
                    i--;
                    continue;
                }
                if (enAmmo[i].hit(player) && player.exist) {
                    //console.log("you dead!");
                    player.exist = false;
                    gameOverd = 33;
                    state = 2;
                    enAmmo.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < plAmmo.length; i++) {
                for (var j = 0; j < enemy.length; j++) {
                    if (plAmmo[i].hit(enemy[j])) {
                        //console.log("hit");
                        plAmmo.splice(i, 1);
                        i--;
                        enemy[j].life--;
                        if (enemy[j].life <= 0) {
                            score += enemy[j].score;
                            debris.push(new ent.Debri(enemy[j].x, enemy[j].y));
                            enemy.splice(j, 1);
                            j--;
                        }
                        break;
                    }
                }
            }
            for (var i = 0; i < enemy.length; i++) {
                if (enemy[i].outStage()) {
                    enemy.splice(i, 1);
                    i--;
                    continue;
                }
                if (player.hitEnemy(enemy[i]) && player.exist) {
                    //console.log("you dead!");
                    player.exist = false;
                    gameOverd = 33;
                    state = 2;
                    enemy.splice(i, 1);
                    i--;
                    continue;
                }
                if (enemy[i].fire()) {
                    let rad = Math.atan2(player.y - enemy[i].y + Math.random() * 10 - 5,
                        player.x - enemy[i].x + Math.random() * 10 - 5);
                    let rx = 8 * Math.cos(rad), ry = 8 * Math.sin(rad);
                    enAmmo.push(new ent.Eammo(enemy[i].x, enemy[i].y, rx, ry));
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            drawBack();

            if (state == 0 || state == 1) player.draw();
            if(state == 2) player.explosion();
            if (state == 1) drawScore();

            for (var i = 0; i < plAmmo.length; i++) {
                plAmmo[i].draw();
            }
            for (var i = 0; i < enAmmo.length; i++) {
                enAmmo[i].draw();
            }
            for (var i = 0; i < enemy.length; i++) {
                enemy[i].draw();
            }
            for (var i = 0; i < debris.length; i++) {
                debris[i].draw();
            }

            if (state === 0) {
                drawMenu();
            } else if (state === 2) {
                drawGameover();
            }
        }

        function drawBack() {
            ctx.drawImage(image.back, 0, 0, WIDTH, HEIGHT, 0, frame % HEIGHT, WIDTH, HEIGHT);
            ctx.drawImage(image.back, 0, 0, WIDTH, HEIGHT, 0, -HEIGHT + frame % HEIGHT, WIDTH, HEIGHT);
            ctx.drawImage(image.backt, 0, 0, WIDTH, HEIGHT, 0, (frame * 1.5) % HEIGHT, WIDTH, HEIGHT);
            ctx.drawImage(image.backt, 0, 0, WIDTH, HEIGHT, 0, -HEIGHT + (frame * 1.5) % HEIGHT, WIDTH, HEIGHT);
        }

        function drawCont() {

        }

        function drawScore() {
            ctx.save();
            ctx.font = "20px bold";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            //ctx.strokeText(`Score:${score}`, 390, 10);
            ctx.fillText(`Score:${score}`, 390, 10);
            //ctx.fillText(`gameFrame:${gameFrame}`, 390, 30);
            //ctx.fillText(30 - (gameFrame / 33) / 20, 390, 50);
            ctx.restore();
        }

        function drawMenu() {
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
            ctx.fillText("雑シューティング", WIDTH / 2, HEIGHT / 2 - 25);
            ctx.strokeText("雑シューティング", WIDTH / 2, HEIGHT / 2 - 25);
            ctx.font = "35px bold";
            ctx.fillText("Push to start", WIDTH / 2, HEIGHT / 2 + 25);
            ctx.strokeText("Push to start", WIDTH / 2, HEIGHT / 2 + 25);
            ctx.restore();
        }

        function drawGameover() {
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
            ctx.fillText("Game Over!", WIDTH / 2, HEIGHT / 2 - 45);
            ctx.strokeText("Game Over!", WIDTH / 2, HEIGHT / 2 - 45);
            ctx.font = "40px bold";
            ctx.fillText(`Your score:${score}`, WIDTH / 2, HEIGHT / 2);
            ctx.strokeText(`Your score:${score}`, WIDTH / 2, HEIGHT / 2);
            ctx.font = "35px bold";
            ctx.fillText("push to back title", WIDTH / 2, HEIGHT / 2 + 40);
            ctx.strokeText("push to back title", WIDTH / 2, HEIGHT / 2 + 40);
            if(!searchQuery.rapid && !searchQuery.hell && !searchQuery.immotal && !searchQuery.local){
                if (rankFlg === 1) {
                    ctx.fillText("get rank now...", WIDTH / 2, HEIGHT / 2 + 80);
                    ctx.strokeText("get rank now...", WIDTH / 2, HEIGHT / 2 + 80);
                } else if (rankFlg === 2) {
                    ctx.fillText(`rank:${rankValue.rank}/${rankValue.total}`, WIDTH / 2, HEIGHT / 2 + 80);
                    ctx.strokeText(`rank:${rankValue.rank}/${rankValue.total}`, WIDTH / 2, HEIGHT / 2 + 80);
                }
            }
            ctx.restore();
        }

    }

    prepare();

});
