var allEnemies = [];
var numTilesX = 5;
var numTilesY = 3;
var rightBorder = 600;

var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.vx = 1;
    this.width = 120;
    this.height = 83;
    this.y = this.initXY(numTilesY, this.height) - 23;
    this.x = -(this.initXY(numTilesX, this.width));
};

Enemy.prototype.add = function () {
    allEnemies.push(this);
};

Enemy.prototype.initXY = function (numTiles, position) {
    var number = Math.floor(Math.random() * numTiles + 1);
    var a = number * position;
    return a;
};

// Parameter: dt, a time delta between ticks
// multiply any movement by the dt parameter to ensure the game runs at the same speed for all computers.
Enemy.prototype.update = function (dt) {
    this.x += this.vx;
    if (this.x == rightBorder) {
        this.y = this.initXY(numTilesY, this.height) - 23;
        this.x = this.x - rightBorder - this.width;
    };
    this.overlap();
};

Enemy.prototype.overlap = function () {
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].y == this.y && allEnemies[i].x == this.x) {
            console.log('double');
            this.x -= this.width;
            break;
        }
    };
    return this.x;
};

Enemy.prototype.collision = function () {
    for (var i = 0; i < allEnemies.length; i++) {

    };
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};








var Player = function () {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 0;
    this.y = 405;
};

Player.prototype.update = function () {};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (input) {
    this.y = (input == 'up' && this.y != -10) ? this.y - 83 : (input == 'down' && this.y != 405) ? this.y + 83 : this.y;
    this.x = (input == 'left' && this.x != 0) ? this.x - 101 : (input == 'right' && this.x != 404) ? this.x + 101 : this.x;
    if (this.y == -10) {
        console.log('winner');
    };
};

var enemy1 = new Enemy();
enemy1.add();
var enemy2 = new Enemy();
enemy2.add();
var enemy3 = new Enemy();
enemy3.add();
var enemy4 = new Enemy();
enemy4.add();
var enemy5 = new Enemy();
enemy5.add();
var enemy6 = new Enemy();
enemy6.add();
var enemy7 = new Enemy();
enemy7.add();
var enemy8 = new Enemy();
enemy8.add();
var enemy9 = new Enemy();
enemy9.add();
var enemy10 = new Enemy();
enemy10.add();

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
