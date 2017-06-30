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
    player.prototype.hitAmmo = function(ent){
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2)) <= 30;
    }
    player.prototype.hitEnemy = function(ent){
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2)) <= 45;
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
    ammo.prototype.hit = function(ent){
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2)) <= 30;
    }

    function eammo(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.img = source.eammo;
    }
    eammo.prototype.draw = function(){
        let rad = Math.atan2(this.vy, this.vx);
        drawRotatedImage(this.img, this.x, this.y, rad + Math.PI / 2);
    }
    eammo.prototype.move = function(){
        this.x += this.vx;
        this.y += this.vy;
    }
    eammo.prototype.hit = function(ent){
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2)) <= 30;
    }
    eammo.prototype.outStage = function(){
        return !(this.x >= -10 && this.x <= 410 && this.y >= -10 && this.y <= 610);
    }

    function enemy(x, y, r, life, score){
        this.x = x;
        this.y = y;
        this.r = r;
        this.life = life;
        this.score = score;
    }
    enemy.prototype.draw = function(){
        drawRotatedImage(this.img, this.x, this.y, this.r);
    }
    enemy.prototype.outStage = function(){
        return !(this.x >= -25 && this.x <= 425 && this.y >= -25 && this.y <= 625);
    }

    function coin(pl){
        let x = ((Math.random() * 400) | 0), y = -25;
        enemy.call(this, x, y, 0, 1, 100);
        this.img = source.coin;
        let rad = Math.atan2(pl.y - y, pl.x - x);
        this.vx = Math.cos(rad) * 7;
        this.vy = Math.sin(rad) * 7;
        this.turned = false;
        this.fired = false;
    }
    Object.setPrototypeOf(coin.prototype, enemy.prototype);
    coin.prototype.update = function(pl){
        this.x += this.vx;
        this.y += this.vy;
        let flg = this.vx > 0 ? this.x > pl.x : this.x < pl.x;
        if(flg && !this.turned) {this.vx *= -1; this.turned = true};
    }
    coin.prototype.fire = function(){
        if(!this.fired && this.turned){
            this.fired = true;
            return ((Math.random() * 3) | 0) === 0;
        }
        return false;
    }

    function kamikaze(pl){
        enemy.call(this, pl.x, -25, 0, 3, 350);
        this.img = source.kamikaze;
    }
    Object.setPrototypeOf(kamikaze.prototype, enemy.prototype);
    kamikaze.prototype.update = function(){
        this.y += 9;
    }
    kamikaze.prototype.fire = function(){
        return ((Math.random() * 75) | 0) === 0;
    }

    function turner(pl){
        let x = ((Math.random() * 400) | 0), y = -25;
        this.toY = 150 + Math.random() * 150;
        let toX = ((Math.random() * 400) | 0);
        let rad = Math.atan2(this.toY - y, toX - x, 200);
        enemy.call(this, x, y, rad - Math.PI / 2, 1, 200);
        this.vx = Math.cos(rad) * 7;
        this.vy = Math.sin(rad) * 7;
        this.stop = 0;
        this.stoped = false;
        this.img = source.turner;
    }
    Object.setPrototypeOf(turner.prototype, enemy.prototype);
    turner.prototype.update = function(){
        if(this.stop == 0){
            this.x += this.vx;
            this.y += this.vy;
        }else{
            this.stop--;
            if(this.stop == 0) this.r = Math.atan2(this.vy, this.vx) - Math.PI / 2;
        }
        if(this.y >= this.toY && !this.stoped){
            this.stop = 20 + ((Math.random() * 21) | 0);
            this.stoped = true;
            this.vy *= -1;
        }
    }
    turner.prototype.fire = function(){
        return this.stop > 0 ? ((Math.random() * 20) | 0) === 0 : false;
    }

    ent.Player = player;
    ent.Coin = coin;
    ent.Ammo = ammo;
    ent.Eammo = eammo;
    ent.Kamikaze = kamikaze;
    ent.Turner = turner;

}
