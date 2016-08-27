 /**
  * @description Game engine
  */
 var Engine = (function engine(global) {
	 var doc = global.document,
		 win = global.window,
		 canvas = doc.createElement('canvas'),
		 ctx = canvas.getContext('2d'),
		 lastTime, s, m, timer, clock;
	 canvas.width = app.WIDTH;
	 canvas.height = app.HEIGHT;
	 doc.body.appendChild(canvas);

	 /**
	  * @description Creates players and enemies. Draws the players.
	  */
	 function init() {
		 s = app.SECONDS;
		 m = app.MINUTES;
		 lastTime = Date.now();
		 if (app.playerLineup < 1) {
			 app.createPlayers();
		 }
		 if (app.allEnemies < 1) {
			 app.createEnemies();
		 }
		 drawPlayers();
	 }

	 /**
	  * Draws all players and registers event listener for a click event
	  */
	 function drawPlayers() {
		 app.playerLineup.forEach(app.renderEntity);
		 document.addEventListener('click', choosePlayer);
	 }

	 /**
	  * @description Checks which player was clicked on and assigns it as the mainPlayer. Starts the timer.
	  * @param {object} e - Event object
	  * @returns {function} main - Starts the game
	  */
	 function choosePlayer(e) {
		 e = app.clickPosition(e);
		 e.y -= app.ELEM_HEIGHT;
		 e.x -= 20;
		 app.playerLineup.forEach(function (player) {
			 if (player.collision(e, player)) {
				 app.mainPlayer = new Player(player.x, player.sprite);
				 clock = setInterval(showTime, 1000);
				 document.removeEventListener('click', choosePlayer);
				 document.addEventListener('keyup', movePlayer);
				 document.addEventListener('click', changeStatus);
				 return main();
			 }
		 });
	 }

	 /**
	  * @description Updates the timer.
	  */
	 function showTime() {
		 if (app.play) {
			 if (m === 0 && s < 0) {
				 clearInterval(clock);
				 endText = 'time out : you lost';
				 app.play = false;
				 app.game = false;
				 return;
			 } else if (s < 0) {
				 m--;
				 s = 59;
			 }
			 timer = (s < 10) ? '0' + m + ':0' + s : '0' + m + ':' + s;
			 s--;
		 }
	 }

	 /**
	  * @description Checks keyboard input.
	  * @param {object} e - Event object
	  */
	 function movePlayer(e) {
		 if (app.ALLOWED_KEYS[e.keyCode] !== undefined && app.game) {
			 app.mainPlayer.handleInput(app.ALLOWED_KEYS[e.keyCode]);
		 }
	 }

	 /**
	  * @description Checks which icon was the target of user input.
	  * @param {object} e - Event object
	  */
	 function changeStatus(e) {
		 app.checkIcon(app.clickPosition(e));
	 }

	 /**
	  * @description Starts/ends the game and keeps updating the animation frame.
	  */
	 function main() {
		 if (app.game) {
			 var now = Date.now(),
				 dt = (now - lastTime) / 1000.0;
			 lastTime = now;
			 if (app.play) {
				 updateEntities(dt);
				 drawCanvas();
				 win.requestAnimationFrame(main);
			 } else {
				 drawCanvas();
				 win.requestAnimationFrame(main);
			 }
		 } else {
			 if (app.play) {
				 reset();
			 } else {
				 app.gameOver(endText);
				 setTimeout(function () {
					 reset();
				 }, 3000);
			 }
		 }
	 }

	 /**
	  * @description Updates mainPlayer and enemies.
	  * @param {number} dt - Time passed since last update
	  */
	 function updateEntities(dt) {
		 app.allEnemies.forEach(function (enemy) {
			 enemy.update(dt);
		 });
		 app.mainPlayer.update();
	 }

	 /**
	  * @description Draws the animation frame.
	  */
	 function drawCanvas() {
		 /**
		  * @description Draws the board.
		  */
		 var row, col;
		 for (row = 0; row < app.NUM_ROWS; row++) {
			 var url = row === 0 ? app.rowImages.water : row < 4 ? app.rowImages.stone : app.rowImages.grass;
			 for (col = 0; col < app.NUM_COLS; col++) {
				 ctx.drawImage(Resources.get(url), col * 101, row * 83);
			 }
		 }
		 /**
		  * @description Draws the timer.
		  */
		 ctx.font = '30px sans-serif';
		 ctx.fillStyle = 'white';
		 if (timer) {
			 ctx.fillText(timer, app.staticElems.playersRow.x + 13, ctx.canvas.height - 30);
		 }
		 /**
		  * @description Draws the elements.
		  */
		 var drawElems = [app.allEnemies, app.starsArray, app.rocksArray, app.mainPlayer, app.staticElems.key];
		 app.icons.forEach(function (icon) {
			 app.drawIcon(icon);
		 });
		 drawElems.forEach(app.renderEntity);
	 }

	 /**
	  * @description Resets the game.
	  */
	 function reset() {
		 /**
		  * @description Stops the timer.
		  */
		 clearInterval(clock);
		 timer = null;
		 /**
		  * @description Clears the canvas.
		  */
		 ctx.canvas.width = ctx.canvas.width;
		 ctx.clearRect(0, 0, canvas.width, canvas.height);
		 /**
		  * @description Clears the elements.
		  */
		 app.mainPlayer = {};
		 app.starsArray = [];
		 app.rocksArray = [];
		 app.allEnemies = [];
		 /**
		  * @description Removes event listeners.
		  */
		 document.removeEventListener('keyup', movePlayer);
		 document.removeEventListener('click', changeStatus);
		 /**
		  * @description Restarts the game.
		  */
		 app.game = true;
		 app.play = true;
		 init();
	 }
	 /**
	  * @description Loads images.
	  */
	 Resources.load([
		'images/stone-block.png',
		'images/water-block.png',
		'images/grass-block.png',
		'images/enemy-bug.png',
		'images/char-cat-girl.png',
		'images/char-boy.png',
		'images/char-pink-girl.png',
		'images/char-horn-girl.png',
		'images/char-princess-girl.png',
		'images/Key.png',
		'images/Star.png',
		'images/Rock.png'
	]);

	 Resources.onReady(init);
	 global.ctx = ctx;

 })(this);
