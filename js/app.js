var allEnemies = [];
var starsArray = [];
var playerLineup = [];
var rocksArray = [];
var icons = [];
var numCols = 5;
var numRows = 3;
var game = true;
var play = true;
var star, enemy, icon, player, rock, restart;

var Enemy = function (speed) {
    this.sprite = 'images/enemy-bug.png';
    this.vx = speed;
    this.width = 101;
    this.height = 83;
    this.y = this.position(numRows, this.height) - 23;
    this.x = -(this.position(numCols, this.width) - 19);
};

function createEnemies() {
    for (var i = 0; i <= 10; i++) {
        if (i == 10) {
            enemy = new Enemy(300);
            enemy.name = 'speedy';
        } else {
            enemy = new Enemy(80);
        }
        allEnemies.push(enemy);
    }
};

Enemy.prototype.position = function (numTiles, measurements) {
    var number = ~~(Math.random() * numTiles + 1);
    var a = number * measurements;
    return a;
};

Enemy.prototype.checkPosition = function () {
    if (this.x >= ctx.canvas.width) {
        this.y = this.position(numRows, this.height) - 23;
        if (this.name == 'speedy') {
            this.x = -this.x * (Math.random() * 9 + 1);
        } else {
            this.x = this.x - this.x - this.width - 19;
        }
    }
};

Enemy.prototype.update = function (dt) {
    this.x = this.x + this.vx * dt;
    this.checkPosition();
};




var Board = function (y, width, height) {
    this.x = 0;
    this.y = y;
    this.width = width;
    this.height = height;
};

var tile = new Board(0, 101, 83);
var board = new Board(-10, 500, 480);
var playersRow = new Board(405, 505, 130);



var Obstacle = function (x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
};

var key = new Obstacle(board.x, board.y, 'images/Key.png');



var Player = function (x, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = playersRow.y;
    this.width = 60;
    this.height = 60;
    this.lives = 5;
    this.points = 5;
    this.resetX = playersRow.x;
    this.resetY = playersRow.y;
};

function createPlayers(rowPlayers) {
    for (var i = 0, j = rowPlayers.length; i < j; i++) {
        var x = i * 101;
        var sprite = rowPlayers[i];
        player = new Player(x, sprite);
        playerLineup.push(player);
    }
};







var Icon = function (x, sprite, name) {
    this.width = 30;
    this.height = 30;
    this.x = x;
    this.y = ctx.canvas.height - 30;
    this.sprite = sprite;
    this.name = name;
}

function createIcons() {
    icon = new Icon(playersRow.width - 83, '\ue808', 'pause');
    icons.push(icon);
    icon = new Icon(playersRow.width - 43, '\ue801', 'restart');
    icons.push(icon);
}

Icon.prototype.collision = function (a, b) {
    return Player.prototype.collision.call(this, a, b);
};






Player.prototype.resetPosition = function () {
    this.x = this.resetX;
    this.y = this.resetY;
};

Player.prototype.handleInput = function (input) {
    var currentX = this.x;
    var currentY = this.y;
    this.y = (input == 'up') ? this.y - tile.height : (input == 'down') ? this.y + tile.height : this.y;
    this.x = (input == 'left') ? this.x - tile.width : (input == 'right') ? this.x + tile.width : this.x;
    this.restrictMoves(currentX, currentY);
};

Player.prototype.restrictMoves = function (x, y) {
    if (!this.collision(this, board) || this.points > 1 && this.collision(key, this)) {
        this.y = y;
        this.x = x;
    }
    this.obstacleCollision(rocksArray, x, y);
    this.obstacleCollision(starsArray, x, y);
};

Player.prototype.obstacleCollision = function (arr, x, y) {
    for (var i = 0, j = arr.length; i < j; i++) {
        if (this.collision(this, arr[i])) {
            this.x = x;
            this.y = y;
            break;
        }
    }
};

Player.prototype.collision = function (a, b) {
    return a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y;
};

Player.prototype.update = function () {
    if (this.y === board.y) {
        this.createStars();
    }
    this.enemyCollision();
    if (!this.lives || !this.points) {
        endText = (!this.lives) ? 'you lost' : 'you won';
        play = false;
        return game = false;
    }
};

Player.prototype.createStars = function () {
    this.points--;
    this.createObstacles(star, starsArray, this.x, this.y, 'images/Star.png');
    this.resetPosition();
}

Player.prototype.enemyCollision = function () {
    for (var i = 0, j = allEnemies.length; i < j; i++) {
        if (this.collision(this, allEnemies[i])) {
            this.lives--;
            this.createObstacles(rock, rocksArray, this.x, this.y - 10, 'images/Rock.png');
            this.resetPosition();
            break;
        }
    }
};

Player.prototype.createObstacles = function (obstacle, arr, x, y, img) {
    obstacle = new Obstacle(x, y, img);
    arr.push(obstacle);
};




Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Icon.prototype.render = function () {
    ctx.font = '30px fontello';
    ctx.fillText(this.sprite, this.x, this.y);
}

Obstacle.prototype.render = function () {
    Enemy.prototype.render.call(this);
};

Player.prototype.render = function () {
    Enemy.prototype.render.call(this);
};



function checkIcon(e) {
    e.y += 20;
    for (var i = 0, j = icons.length; i < j; i++) {
        if (icon.collision(e, icons[i])) {
            if (icons[i].name === 'pause') {
                icons[i].name = 'play';
                icons[i].sprite = '\ue807';
                return play = false;
            } else if (icons[i].name === 'play') {
                icons[i].name = 'pause';
                icons[i].sprite = '\ue808';
                return play = true;
            } else {
                endText = '';
                play = true;
                return game = false;
            };
            break;
        };
    };
}

function clickPosition(e) {
    var left = ctx.canvas.offsetLeft;
    var top = ctx.canvas.offsetTop;
    e = {
        x: e.pageX - left,
        y: e.pageY - top,
        height: 1,
        width: 1
    };
    return e;
}

function gameOver(text) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, ctx.canvas.height - 140, ctx.canvas.width, 140);
    ctx.font = '40px sans-serif';
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.fillText(text.toUpperCase(), ctx.canvas.width / 2, ctx.canvas.height - 70);
};



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

document.addEventListener('mousedown', function (e) {
    checkIcon(clickPosition(e));
});
