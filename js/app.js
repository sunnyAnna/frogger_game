var allEnemies = [];
var starsArray = [];
var playerLineup = [];
var rocksArray = [];
var numCols = 5;
var numRows = 3;
var game = true;
var star, enemy, player;

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

Enemy.prototype.createEnemy = function () {
    for (var i = 0; i <= 10; i++) {
        if (i == 10) {
            enemy = new Enemy(300);
            this.name = 'speedy';
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

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};









function gameOver(text) {
    ctx.font = '50px serif';
    ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height - 75);
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

var tile = new Tile();
var board = new Board(404, 0, -10, 405);
var playersRow = new Board(505, 0, 405, 606);



var Player = function (x, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = board.bottom;
    this.width = 60;
    this.height = 60;
    this.lives = 5;
    this.points = 0;
    this.active = false;
};

Player.prototype.createPlayers = function (rowPlayers) {
    for (var i = 0, j = rowPlayers.length; i < j; i++) {
        var x = i * 101;
        var sprite = rowPlayers[i];
        player = new Player(x, sprite);
        playerLineup.push(player);
    }
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
    if (this.y == board.top) {
        this.points++;
        this.createStar(this.x, this.y);
        this.x = board.left;
        this.y = board.bottom;
    }
};

Player.prototype.enemyCollision = function (x, y) {
    for (var i = 0, j = allEnemies.length; i < j; i++) {
        if (this.collision(this, allEnemies[i])) {
            this.lives--;
            this.createRock(this.x, this.y);
            this.x = board.left;
            this.y = board.bottom;
            break;
        }
    }
};

Player.prototype.obstacleCollision = function (obj, x, y) {
    for (var i = 0, j = obj.length; i < j; i++) {
        if (this.collision(this, obj[i])) {
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

Player.prototype.onCanvas = function (a, b) {
    return a.x >= b.left &&
        a.x <= b.right &&
        a.y >= b.top &&
        a.y <= b.bottom;
};

Player.prototype.update = function () {
    this.enemyCollision();
    if (this.lives == 0 || this.points == 5) {
        endText = (this.lives == 0) ? 'you lost' : 'you won';
        return game = false;
    }
};

Player.prototype.render = function () {
    Enemy.prototype.render.call(player);
};






var Star = function (x, y) {
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
};

Player.prototype.createStar = function (x, y) {
    star = new Star(x, y);
    starsArray.push(star);
};

Star.prototype.render = function () {
    Enemy.prototype.render.call(star);
};

var Rock = function (x, y) {
    this.sprite = 'images/Rock.png';
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
};

Player.prototype.createRock = function (x, y) {
    rock = new Rock(x, y);
    rocksArray.push(rock);
};

Rock.prototype.render = function () {
    Enemy.prototype.render.call(rock);
};

var choosePlayer = function (e) {
    var left = ctx.canvas.offsetLeft;
    var top = ctx.canvas.offsetTop;
    var e = {
        x: e.pageX - left,
        y: e.pageY - top
    };
    for (var i = 0, j = playerLineup.length; i < j; i++) {
        if (player.onCanvas(e, playersRow)) {
            if (i < 4 && e.x >= playerLineup[i].x && e.x < playerLineup[i + 1].x ||
                i == 4 && e.x >= playerLineup[i].x
            ) {
                player = playerLineup[i];
                player.active = true;
                break;
            }
        }
    }
    document.removeEventListener('click', choosePlayer);
    return player;
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
