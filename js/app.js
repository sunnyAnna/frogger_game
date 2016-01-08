var allEnemies = [];
var starsArray = [];
var playerLineup = [];
var rocksArray = [];
var keys = [];
var icons = [];
var numCols = 5;
var numRows = 3;
var game = true;
var play = true;
var star, enemy, icon, player, rock;

var Enemy = function (speed) {
    this.sprite = 'images/enemy-bug.png';
    this.vx = speed;
    this.width = 101;
    this.height = 83;
    this.y = this.position(numRows, this.height) - 23;
    this.x = -(this.position(numCols, this.width) - 19);
};

Enemy.prototype.position = function (numTiles, measurements) {
    var number = Math.floor(Math.random() * numTiles + 1);
    var a = number * measurements;
    return a;
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

Enemy.prototype.update = function (dt) {
    this.x = this.x + this.vx * dt;
    if (this.x >= ctx.canvas.width) {
        this.y = this.position(numRows, this.height) - 23;
        if (this.name == 'speedy') {
            this.x = -this.x * (Math.random() * 9 + 1);
        } else {
            this.x = this.x - this.x - this.width - 19;
        }
    }
};









var Tile = function () {
    this.width = 101;
    this.height = 83;
};

var Board = function (right, left, top, bottom) {
    this.right = right;
    this.left = left;
    this.top = top;
    this.bottom = bottom;
};

var Obstacle = function (x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
};

var Player = function (x, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = board.bottom;
    this.width = 60;
    this.height = 60;
    this.lives = 5;
    this.points = 5;
    this.active = false;
    this.resetX = board.left;
    this.resetY = board.bottom;
};

var Icon = function (x, sprite, name) {
    this.width = 30;
    this.height = 30;
    this.x = x;
    this.y = playersRow.bottom - 30;
    this.sprite = sprite;
    this.name = name;
}

function createIcons() {
    for (var i = 0; i < 2; i++) {
        if (i === 1) {
            icon = new Icon(playersRow.right - 83, '\ue808', 'pause');
        } else {
            icon = new Icon(playersRow.right - 43, '\ue801', 'restart');
        }
        icons.push(icon);
    }
}

Icon.prototype.activate = function () {

}

var tile = new Tile();
var board = new Board(404, 0, -10, 405);
var key = new Obstacle(board.left, board.top, 'images/Key.png');
keys.push(key);
var playersRow = new Board(505, 0, 405, 606);

function createPlayers(rowPlayers) {
    for (var i = 0, j = rowPlayers.length; i < j; i++) {
        var x = i * 101;
        var sprite = rowPlayers[i];
        player = new Player(x, sprite);
        playerLineup.push(player);
    }
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
    if (this.onCanvas(this, board) == false) {
        this.y = currentY;
        this.x = currentX;
    }
    this.obstacleCollision(rocksArray, currentX, currentY);
    this.obstacleCollision(starsArray, currentX, currentY);
    if (this.points > 1) {
        this.obstacleCollision(keys, currentX, currentY);
    }
    if (this.y == board.top) {
        this.points--;
        this.createObstacle(star, starsArray, this.x, this.y, 'images/Star.png');
        this.resetPosition();
    }
};

Player.prototype.enemyCollision = function () {
    for (var i = 0, j = allEnemies.length; i < j; i++) {
        if (this.collision(this, allEnemies[i])) {
            this.lives--;
            this.createObstacle(rock, rocksArray, this.x, this.y - 10, 'images/Rock.png');
            this.resetPosition();
            break;
        }
    }
};

Player.prototype.createObstacle = function (obstacle, arr, x, y, img) {
    obstacle = new Obstacle(x, y, img);
    arr.push(obstacle);
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

Icon.prototype.collision = function (a, b) {
    return a.x <= b.x + b.width &&
        a.x >= b.x &&
        a.y <= b.y + b.height &&
        a.y >= b.y;
}

Player.prototype.onCanvas = function (a, b) {
    return a.x >= b.left &&
        a.x <= b.right &&
        a.y >= b.top &&
        a.y <= b.bottom;
};

Player.prototype.update = function () {
    this.enemyCollision();
    if (this.lives == 0 || this.points == 0) {
        endText = (this.lives == 0) ? 'you lost' : 'you won';
        return game = false;
    }
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Icon.prototype.render = function () {
    ctx.font = '30px fontello';
    ctx.fillText(this.sprite, this.x, this.y);
}

Obstacle.prototype.render = function (obj) {
    this.obj = obj;
    Enemy.prototype.render.call(obj);
};

Player.prototype.render = function (obj) {
    this.obj = obj;
    Enemy.prototype.render.call(obj);
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

document.addEventListener('click', function (e) {
    var left = ctx.canvas.offsetLeft;
    var top = ctx.canvas.offsetTop - 30;
    var e = {
        x: e.pageX - left,
        y: e.pageY - top
    };
    console.log(e.x, e.y);
    for (var i = 0, j = icons.length; i < j; i++) {
        if (icon.collision(e, icons[i])) {
            if (icons[i].name === 'pause') {
                icons[i].name = 'play';
                icons[i].sprite = '\ue807';
                return play = false;
            };
            if (icons[i].name === 'play') {
                icons[i].name = 'pause';
                icons[i].sprite = '\ue808';
                play = true;
                return
            };
            if (icons[i].name == 'restart') {
                endText = '';
                return game = false;
            };
        };
    };
});

function gameOver(text) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '40px sans-serif';
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.fillText(text.toUpperCase(), ctx.canvas.width / 2, playersRow.bottom - 70);
};
