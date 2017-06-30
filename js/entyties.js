window._setEntyties = function(source, ctx, ent){

    function drawRotatedImage(i, x, y, r){
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(r);
        ctx.drawImage(i, -i.width / 2, -i.height / 2);
        ctx.restore();
    }

    function player(x, y){
        this.x = x;
        this.y = y;
        this.img = source.player;
    }
    player.prototype.move = function(x, y){
        this.x += x;
        this.y += y;
        if(this.x < 25) this.x = 25;
        if(this.x > 375) this.x = 375;
        if(this.y < 25) this.y = 25;
        if(this.y > 575) this.y = 575;
    }
    player.prototype.draw = function(){
        ctx.drawImage(this.img, this.x - 25, this.y - 25);
    }

    function ammo(x, y){
        this.x = x;
        this.y = y;
        this.img = source.ammo;
    }
    ammo.prototype.draw = function(){
        ctx.drawImage(this.img, this.x - 10, this.y - 10);
    }
    ammo.prototype.move = function(){
        this.y -= 12;
    }

    function enemy(x, y, r, life){
        this.x = x;
        this.y = y;
        this.r = r;
        this.life = life;
    }
    enemy.prototype.draw = function(){
        drawImage(this.img, this.x - 25, this.y - 25, this.r);
    }

    function coin(pl){
        let x, y;
        x = ((Math.random() * 200) | 0) + pl.x < 200 ? 0 : 200;
        y = -25;
        enemy.call(this, x, y, 0, 1);
        this.img = source.coin;
        let rad = Math.atan2(pl.y - y, pl.x - x);
        this.vx = Math.cos(rad) * 7;
        this.vy = Math.sin(rad) * 7;
    }
    coin.prototype.update = function(pl){
        this.x += this.vx;
        this.y += this.vy;
        let flg = this.vx > 0 ? this.x > pl.x : this.x < pl.x;
        if(flg) this.vx *= -1;
    }

    ent.Player = player;
    ent.Coin = coin;
    ent.Ammo = ammo;

}