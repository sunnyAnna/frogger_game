var allEnemies = [];
/*
function initXY(numTiles, pos) {
    var number = Math.floor(Math.random() * numTiles + 1);
    var a = pos[number - 1];
    return a;
};*/

function initXY(spacing){
var a = spacing.shift();
spacing.push(a);
return a;
};

var numTilesX = 5;
var numTilesY = 3;
var spacingX = [-100, -220, -340, -460, -540];
var spacingY = [60, 145, 225];
var rightBorder = 500;

var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.vx = 1;
    this.width = 101;
    this.height = 83;
    this.y = initXY(spacingY);
    this.x = initXY(spacingX);
};

// Parameter: dt, a time delta between ticks
// multiply any movement by the dt parameter to ensure the game runs at the same speed for all computers.
Enemy.prototype.update = function (dt) {
    this.x += this.vx;
    if (this.x == rightBorder) {
        this.y = initXY(spacingY);
        this.x = this.x - rightBorder - this.width;
    }
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.add = function () {
    allEnemies.push(this);
}






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
