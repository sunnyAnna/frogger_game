var initY = function () {
    var numTilesY = 3;
    var num = Math.floor(Math.random() * numTilesY + 1);
    var y = (num === 1) ? 60 : (num === 2) ? 145 : 225;
    return y;
};

var initX = function (y) {
    var numTilesX = 5;
    var num = Math.floor(Math.random() * numTilesX + 1);
    var x = (num == 5) ? -540 : (num == 4) ? -460 : (num == 3) ? -340 : (num == 2) ? -220 : -100;
    if (allEnemies) {
        for (var i = 0, j = allEnemies.length; i < j; i++) {
            if (allEnemies[i].y == y && (allEnemies[i].x <= x || allEnemies[i].x == x)) {
                console.log('gotcha');

                //this.x = Math.max(allEnemies[]);
            }
            return x;
        }
    }
    return x;
};

var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.y = initY();
    this.x = initX(this.y);
    this.vx = 1;
    this.vy = 0;
    this.width = 101;
    this.height = 83;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x == 500) {
        this.y = initY();
        this.x = initX(this.y);
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 250;
    this.y = 400;
    this.vx = 2;
    this.vy = 5;
};

Player.prototype.update = function () {

};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (input) {
    this.x = (input == 'left') ? this.x - 101 : (input == 'right') ? this.x + 101 : this.x;
    this.y = (input == 'up') ? this.y - 83 : (input == 'down') ? this.y + 83 : this.y;
    this.x += this.vx;
    this.y += this.vy;
};


var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new Enemy();

var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];

var player = new Player();

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (allowedKeys[e.keyCode] !== undefined) {
        player.handleInput(allowedKeys[e.keyCode]);
    };
});
