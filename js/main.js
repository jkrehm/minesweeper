require.config({
    paths: {
        'domready': 'vendor/domReady',
        'jquery': 'vendor/jquery-1.10.1.min',
        'reactor': 'vendor/reactor',
        'lodash': 'vendor/lodash.min',
    }
});

require(['game/minesweeper', 'game/controls'], function(minesweeper) {

    // Start the game
    minesweeper.newGame();
});