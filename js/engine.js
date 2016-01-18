/**
 * Game engine
 */
var Engine = (function engine(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime, s, m, timer, clock;
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /**
     * Updates the animation frame
     */
    function main() {
        if (game) {
            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;
            lastTime = now;
            if (play) {
                updateEntities(dt);
                render();
                win.requestAnimationFrame(main);
            } else {
                render();
                win.requestAnimationFrame(main);
            }
        } else {
            if (play) {
                reset();
            } else {
                gameOver(endText);
                setTimeout(function() {
                    reset();
                }, 3000);
            }
        }
    }

    /**
     * Creates the player, enemies and icons
     */
    function init() {
        lastTime = Date.now();
        drawPlayers();
        createEnemies();
        createIcons();
    }

    /**
     * Updates the player and enemies
     * @param {number} dt - Time passed from last animation frame
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /**
     * Creates an array of players
     */
    function drawPlayers() {
        var rowPlayers = [
            'images/char-cat-girl.png', // Players displated from the left
            'images/char-boy.png',
            'images/char-pink-girl.png',
            'images/char-horn-girl.png',
            'images/char-princess-girl.png'
        ];
        createPlayers(rowPlayers);
        playerLineup.forEach(function(player) {
            player.render(player);
        });
        document.addEventListener('click', choosePlayer);
    }

    /**
     * Checks which player was clicked on
     * @param {object} e - Event object
     * @returns {function} main() - Global function
     */
    function choosePlayer(e) {
        e = clickPosition(e);
        e.y -= player.height;
        e.x -= 20;
        for (var i = 0; i < playerLineup.length; i++) {
            if (player.collision(e, playerLineup[i])) {
                document.removeEventListener('click', choosePlayer);
                player = playerLineup[i];
                playerLineup = [];
                countdown();
                return main();
            }
        }
    }

    /**
     * Resets the timer
     */
    function countdown() {
        m = 1;
        s = 59;
        clock = setInterval(showTime, 1000);
    }

    /**
     * Runs the timer
     */
    function showTime() {
        if (play) {
            if (m === 0 && s < 0) {
                clearInterval(clock);
                endText = 'time out : you lost';
                play = false;
                game = false;
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
     * Draws the animation frame
     */
    function render() {
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'white';
        if (timer) {
            ctx.fillText(timer, playersRow.x + 13, ctx.canvas.height - 30);
        }
        icons.forEach(function(icon) {
            icon.render();
        });
        renderEntities();
    }

    /**
     * Draws the player, enemies and obstacles
     */
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        starsArray.forEach(function(star) {
            star.render();
        });
        rocksArray.forEach(function(rock) {
            rock.render();
        });
        player.render();
        key.render();
    }

    /**
     * Resets the game
     */
    function reset() {
        clearInterval(clock);
        ctx.canvas.width = ctx.canvas.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game = true;
        play = true;
        icons = [];
        timer = '';
        starsArray = [];
        rocksArray = [];
        allEnemies = [];
        init();
    }

    /**
     * Loads images
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

    /**
     * Invokes a global function
     */
    Resources.onReady(init);

    global.ctx = ctx;

})(this);
