var allEnemies = [];
var playersDisplay = [];
var numCols = 5;
var numRows = 3;
var game = true;

var Enemy = function (speed) {
    this.sprite = 'images/enemy-bug.png';
    this.vx = speed;
    this.width = 101;
    this.height = 83;
    this.y = this.position(numRows, this.height) - 23;
    this.x = -(this.position(numCols, this.width)) - 19;
};

Enemy.prototype.add = function () {
    allEnemies.push(this);
};

Enemy.prototype.position = function (numTiles, measurements) {
    var number = Math.floor(Math.random() * numTiles + 1);
    var a = number * measurements;
    return a;
};

// Parameter: dt, a time delta between ticks
// multiply any movement by the dt parameter to ensure the game runs at the same speed for all computers.
Enemy.prototype.update = function (dt) {
    this.x = this.x + this.vx * dt;
    if (this.x >= ctx.canvas.width) {
        this.y = this.position(numRows, this.height) - 23;
        if (this.vx >= 160) {
            this.x = -this.x * (Math.random() * 9 + 1);
        } else {
            this.x = this.x - this.x - this.width;
        }
    };
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.x === allEnemies[i].x && this.y === allEnemies[i].y) {

        };
    };
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};









function gameOver(text) {
    ctx.font = '50px serif';
    ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height - 75);
};



var Player = function () {
    this.sprite = '';
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

var enemy1 = new Enemy(80);
enemy1.add();
var enemy2 = new Enemy(80);
enemy2.add();
var enemy3 = new Enemy(80);
enemy3.add();
var enemy4 = new Enemy(80);
enemy4.add();
var enemy5 = new Enemy(80);
enemy5.add();
var enemy6 = new Enemy(80);
enemy6.add();
var enemy7 = new Enemy(80);
enemy7.add();
var enemy8 = new Enemy(80);
enemy8.add();
var enemy9 = new Enemy(80);
enemy9.add();
var enemy10 = new Enemy(300);
enemy10.add();

var player = new Player();

function addClick(images) {
    document.addEventListener('click', function (e) {
        var left = ctx.canvas.offsetLeft;
        var top = ctx.canvas.offsetTop;
        var x = e.pageX - left;
        var y = e.pageY - top;
        if (y >= player.y + player.height && y < ctx.canvas.height) {
            console.log(x, y);
            player.sprite = images[Math.floor(x / 101)];
        }
        return player.sprite;
    });
    return player.sprite;
}

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
