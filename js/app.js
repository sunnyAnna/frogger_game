var allEnemies = [];

var initY = function () {
    var numTilesY = 3;
    var num = Math.floor(Math.random() * numTilesY + 1);
    var pos = [60, 145, 225];
    var y = pos[num - 1];
    return y;
};

var initX = function (y) {
    var numTilesX = 5;
    var num = Math.floor(Math.random() * numTilesX + 1);
    var pos = [-100, -220, -340, -460, -540];
    var x = pos[num - 1];
    for (var i = 0, j = allEnemies.length; i < j; i++) {
        if (y == allEnemies[i].y && (x > allEnemies[i].x + 120 || x + 120 < allEnemies[i].x)) {
            break;
        } else if (i = j - 1) {
            i=?;
        }
    }
    return x;
};

var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.vx = 1;
    this.width = 101;
    this.height = 83;
    this.y = initY();
    this.x = initX(this.y);
};

// Parameter: dt, a time delta between ticks
// multiply any movement by the dt parameter to ensure the game runs at the same speed for all computers.
Enemy.prototype.update = function (dt) {
    if (this.x == 500) {
        this.y = initY();
        this.x = initX(this.y);
    }
    this.x += this.vx;
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.add = function () {
    allEnemies.push(this);
}






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
