/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function (global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime, m = 1,
        s = 59,
        timer;
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    function main() {
        if (game && play) {
            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;
            updateEntities(dt);
            render();
            lastTime = now;
            win.requestAnimationFrame(main);
        } else if (game) {
            win.requestAnimationFrame(render);
        } else {
            gameOver(endText);
            win.requestAnimationFrame(reset);
            init();
        }
    }

    function init() {
        lastTime = Date.now();
        drawPlayers();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function drawPlayers() {
        var rowPlayers = [
        'images/char-cat-girl.png', // Players displated from the left
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png'
        ];
        createPlayers(rowPlayers);
        playerLineup.forEach(function (player) {
            player.render(player);
        });
        document.addEventListener('click', choosePlayer);
    }

    function choosePlayer(e) {
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
                    player = new Player(player.x, player.sprite);
                    player.active = true;
                    playerLineup = [];
                    break;
                }
            }
        }
        document.removeEventListener('click', choosePlayer);
        createEnemies();
        main();
        createIcons();
        countdown();
    };

    function countdown() {
        setInterval(showTime, 1000);
    }

    function showTime() {
        if (m === 0 && s < 0) {
            clearInterval(showTime);
            endText = 'time out : you lost';
            game = false;
            return;
        } else if (s < 0) {
            m--;
            s = 59;
        }
        timer = (s < 10) ? '0' + m + ':0' + s : '0' + m + ':' + s;
        ctx.fillStyle = 'white';
        s--;
    }

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
        ctx.fillText(timer, playersRow.left + 13, playersRow.bottom - 30);
        icons.forEach(function (icon) {
            icon.render();
        })
        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });
        starsArray.forEach(function (star) {
            star.render(star);
        });
        rocksArray.forEach(function (rock) {
            rock.render(rock);
        });
        player.render(player);
        key.render(key);
    }

    function reset() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        main();
    }



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
