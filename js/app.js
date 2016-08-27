var app = app || {
	WIDTH: 505,
	HEIGHT: 606,
	ELEM_WIDTH: 60,
	ELEM_HEIGHT: 60,
	NUM_ENEMIES: 11,
	NUM_PLAYERS: 5,
	NUM_COLS: 5,
	NUM_ROWS: 6,
	ENEMY_ROWS: 3,
	SECONDS: 59,
	MINUTES: 1,
	ALLOWED_KEYS: {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	},
	DEF: null,
	game: true,
	play: true,
	allEnemies: [],
	starsArray: [],
	playerLineup: [],
	rocksArray: [],
	mainPlayer: {},
	rowPlayers: [
		'images/char-cat-girl.png',
		'images/char-boy.png',
		'images/char-pink-girl.png',
		'images/char-horn-girl.png',
		'images/char-princess-girl.png'
	],
	rowImages: {
		water: 'images/water-block.png',
		stone: 'images/stone-block.png',
		grass: 'images/grass-block.png'
	}
};

/**
 * @description Icon array with pause and restart icons.
 */
app.icons = [
	new Element(app.WIDTH - 83, app.HEIGHT - 30, 30, 30, '\ue808', 'pause'),
	new Element(app.WIDTH - 43, app.HEIGHT - 30, 30, 30, '\ue801', 'restart')
];

app.staticElems = {
	tile: new Element(0, 0, 101, 83, null, null),
	board: new Element(0, -10, 500, 480, null, null),
	playersRow: new Element(0, 405, app.WIDTH, 130, null, null),
	key: new Element(0, 0, app.DEF, app.DEF, 'images/Key.png', null)
};

/**
 * @description Creates a random number.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
app.randomNum = function (a, b) {
	var number = Math.floor(Math.random() * a + 1),
		c = number * b;
	return c;
};

/**
 * @description Creates an array of enemies.
 */
app.createEnemies = function () {
	var i, j = app.NUM_ENEMIES,
		enemy;
	for (i = 1; i <= j; i++) {
		if (i === j) {
			enemy = new Enemy(300);
			enemy.name = 'speedy';
		} else {
			enemy = new Enemy(80);
		}
		app.allEnemies.push(enemy);
	}
};

/**
 * @description Creates an array of players.
 * @param {array} rowPlayers - Player images array
 */
app.createPlayers = function () {
	var i, j = app.rowPlayers.length,
		player;
	for (i = 0; i < j; i++) {
		var x = i * 101,
			sprite = app.rowPlayers[i];
		player = new Player(x, sprite);
		app.playerLineup.push(player);
	}
};

/**
 * @description Checks the event object's coordinates.
 * @param {object} e - Event object
 * @returns {object} Event object with new parameters
 */
app.clickPosition = function (e) {
	var left = ctx.canvas.offsetLeft,
		top = ctx.canvas.offsetTop;
	e = {
		x: e.pageX - left,
		y: e.pageY - top,
		height: 1,
		width: 1
	};
	return e;
};

/**
 * @description Checks which icon was clicked on. Updates play/game status.
 * @param {object} e - Event object
 * @returns {boolean} Updates game and/or play variable
 */
app.checkIcon = function (e) {
	e.y += 20;
	var icons = app.icons,
		i, j = icons.length;
	for (i = 0; i < j; i++) {
		if (Player.prototype.collision(e, icons[i])) {
			if (icons[i].name === 'pause') {
				icons[i].name = 'play';
				icons[i].sprite = '\ue807';
				app.play = false;
			} else if (icons[i].name === 'play') {
				icons[i].name = 'pause';
				icons[i].sprite = '\ue808';
				app.play = true;
			} else {
				endText = '';
				app.play = true;
				app.game = false;
			}
			break;
		}
	}
};

/**
 * @description Renders pause/restart icons.
 */
app.drawIcon = function (x) {
	ctx.font = '30px fontello';
	ctx.fillText(x.sprite, x.x, x.y);
};

/**
 * @description Renders the elements.
 */
app.renderEntity = function (elem) {
	if (Array.isArray(elem)) {
		if (elem.length > 0) {
			elem.forEach(function (x) {
				x.render();
			});
		}
	} else {
		elem.render();
	}
};

/**
 * @description Creates a frame to display at the end of the game.
 * @param {string} text - Text to display
 */
app.gameOver = function (text) {
	ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
	ctx.fillRect(0, ctx.canvas.height - 140, ctx.canvas.width, 140);
	ctx.font = '40px sans-serif';
	ctx.fillStyle = "black";
	ctx.textAlign = 'center';
	ctx.fillText(text.toUpperCase(), ctx.canvas.width / 2, ctx.canvas.height - 70);
};

/**
 * @description Element class
 * @constructor
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width
 * @param {number} height
 * @param {string} sprite
 * @param {string} name
 */
function Element(x, y, width, height, sprite, name) {
	this.x = x;
	this.y = y;
	this.width = width || app.ELEM_WIDTH;
	this.height = height || app.ELEM_HEIGHT;
	this.sprite = sprite;
	this.name = name;
	this.render = function () {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	};
}

/**
 * @description Enemy class
 * @constructor
 * @param {number} speed - Speed of the enemy
 */
function Enemy(speed) {
	var x = -(app.randomNum(app.NUM_COLS, 101) - 19);
	var y = app.randomNum(app.ENEMY_ROWS, 83) - 23;
	Element.call(this, x, y, 101, 83, 'images/enemy-bug.png', this.name);
	this.vx = speed;
}

Enemy.prototype = {
	constructor: Enemy,
	checkPosition: function () {
		if (this.x >= ctx.canvas.width) {
			this.y = app.randomNum(app.ENEMY_ROWS, this.height) - 23;
			if (this.name == 'speedy') {
				this.x = -this.x * (Math.random() * 9 + 1);
			} else {
				this.x = this.x - this.x - this.width - 19;
			}
		}
	},
	update: function (dt) {
		this.x = this.x + this.vx * dt;
		this.checkPosition();
	}
};

/**
 * @description Player class
 * @constructor
 * @param {number} x - Player x coordinate
 * @param {string} sprite - Player image
 */
function Player(x, sprite) {
	Element.call(this, x, app.staticElems.playersRow.y, app.DEF, app.DEF, sprite, null);
	this.lives = 5;
	this.points = 5;
	this.resetX = app.staticElems.playersRow.x;
	this.resetY = app.staticElems.playersRow.y;
}

/**
 * @description Resets player position and removes one life or point.
 */
Player.prototype = {
	constructor: Player,
	resetPosition: function () {
		this.x = this.resetX;
		this.y = this.resetY;
	},
	handleInput: function (input) {
		var currentX = this.x,
			currentY = this.y;
		this.y = (input === 'up') ? this.y - app.staticElems.tile.height : (input === 'down') ? this.y + app.staticElems.tile.height : this.y;
		this.x = (input === 'left') ? this.x - app.staticElems.tile.width : (input === 'right') ? this.x + app.staticElems.tile.width : this.x;
		this.restrictMoves(currentX, currentY);
	},
	restrictMoves: function (x, y) {
		if (!this.collision(this, app.staticElems.board) || this.points > 1 && this.collision(app.staticElems.key, this)) {
			this.y = y;
			this.x = x;
		}
		this.obstacleCollision(app.rocksArray, x, y);
		this.obstacleCollision(app.starsArray, x, y);
	},
	obstacleCollision: function (arr, x, y) {
		var i, j = arr.length;
		for (i = 0; i < j; i++) {
			if (this.collision(this, arr[i])) {
				this.x = x;
				this.y = y;
				break;
			}
		}
	},
	collision: function (a, b) {
		return a.x <= b.x + b.width &&
			a.x + a.width >= b.x &&
			a.y <= b.y + b.height &&
			a.y + a.height >= b.y;
	},
	update: function () {
		if (this.y === app.staticElems.board.y) {
			this.createStars();
		}
		this.enemyCollision();
		this.checkIfOver();
	},
	checkIfOver: function () {
		if (!this.lives || !this.points) {
			endText = (!this.lives) ? 'you lost' : 'you won';
			app.play = false;
			app.game = false;
		}
	},
	createStars: function () {
		this.createObstacles(app.starsArray, this.x, this.y, 'images/Star.png');
		this.resetPosition();
		this.points--;
	},
	enemyCollision: function () {
		var i, j = app.allEnemies.length;
		for (i = 0; i < j; i++) {
			if (this.collision(this, app.allEnemies[i])) {
				this.createObstacles(app.rocksArray, this.x, this.y - 10, 'images/Rock.png');
				this.resetPosition();
				this.lives--;
				break;
			}
		}
	},
	createObstacles: function (arr, x, y, img) {
		var obstacle = new Element(x, y, app.DEF, app.DEF, img, null);
		arr.push(obstacle);
	}
};
