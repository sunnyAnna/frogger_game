var initY = function(){
    var tileHight = 60;
    var max = tileHight * 4;
    for (var i = 0; i < max; i++) {
        var num = Math.floor(Math.random() * max + 1);
        if (num % tileHight === 0) {
            var y = num;
            return y;
        }
    }
};

var initX = function(){
    var tileWidth = 80;
    var max = tileWidth * 6;
    for (var i = 0; i < max; i++) {
        var num = Math.floor(Math.random() * max + 1);
        if (num % tileWidth === 0) {
            var x = num;
            return x;
        }
    }
};

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = initX();
    this.y = initY();
    this.vx = 1;
    this.vy = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.vx;
    this.y += this.vy;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(){
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
    this.x = (input == 'left') ? this.x-101 : (input == 'right') ? this.x+101 : this.x;
    this.y = (input == 'up') ? this.y-83 : (input == 'down') ? this.y+83 : this.y;
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


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (allowedKeys[e.keyCode] !== undefined) {player.handleInput(allowedKeys[e.keyCode]);};
});
