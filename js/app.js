var allEnemies = [];
var numTilesX = 5;
var numTilesY = 3;
var rightBorder = 505;
var game = true;

var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.vx = 1;
    this.width = 101;
    this.height = 83;
    this.y = this.initXY(numTilesY, this.height) - 23;
    this.x = -(this.initXY(numTilesX, this.width)) - 19;
    this.active = 1;
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
    if (this.active == 1) {
        for (var i = 0; i < allEnemies.length; i++) {
            if (this.collision(this, allEnemies[i])) {
                //this.active=0;
            };
        };
    };
};

Enemy.prototype.collision = function (a, b) {
    return a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y;
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




function gameOver(text) {
    ctx.font = '50px serif';
    ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height - 75);
};



var Player = function () {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 0;
    this.y = 405;
    this.width = 60;
    this.height = 60;
    this.lives = 5;
    this.points = 0;
};

Player.prototype.update = function () {
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.collision(this, allEnemies[i])) {
            console.log('bam');
            this.lives--;
            this.x = 0;
            this.y = 405;
            break;
        } else if (this.lives == 0) {
            endText = 'you lost';
            return game = false;
        }
    }
    if (this.y == -10) {
        this.points++;
        this.x = 0;
        this.y = 405;
    }
    if (this.points == 5) {
        endText = 'you won';
        return game = false;
    }

};

Player.prototype.collision = function (a, b) {
    return a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y;
};

Player.prototype.render = function () {
    Enemy.prototype.render.call(player);
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
    if (allowedKeys[e.keyCode] !== undefined && game) {
        player.handleInput(allowedKeys[e.keyCode]);
    };
});
