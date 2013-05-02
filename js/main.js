var difficulties = {
    easy: {
        size: 8,
        bombs: 10
    },
    medium: {
        size: 16,
        bombs: 30
    },
    hard: {
        size: 32,
        bombs: 90
    }
};

var minesweeper = {
    difficulty: null,
    size: 0,
    bombs: 0,
    grid: null,
    infiniteLoop: 0,

    newGame: function(difficulty) {
        minesweeper.difficulty = difficulty || 'easy';
        minesweeper.size = difficulties[minesweeper.difficulty].size;
        minesweeper.bombs = difficulties[minesweeper.difficulty].bombs;

        minesweeper.makeBoard();
    },

    makeBoard: function() {
        var i, j;

        minesweeper.grid = new Array();

        for (i = 0; i < minesweeper.size; i++) {
            minesweeper.grid[i] = new Array();

            for (j = 0; j < minesweeper.size; j++) {

                minesweeper.grid[i][j] = '';

            }
        }

        for (i = 0; i < minesweeper.bombs; i++) {
            minesweeper.placeBomb();
        }

        minesweeper.populateBoard();

        $('#minesweeper').append( minesweeper.generateHTML() );
    },

    placeBomb: function() {
        var x, y;

        x = _.random(0, minesweeper.size-1);
        y = _.random(0, minesweeper.size-1);

        if (minesweeper.grid[y][x] != '' && minesweeper.infiniteLoop < (Math.pow(minesweeper.size, 2))) {

            minesweeper.infiniteLoop++;
            minesweeper.placeBomb();

        } else {

            minesweeper.infiniteLoop = 0;
            minesweeper.grid[y][x] = 'x';

        }
    },

    populateBoard: function() {
        for (x = 0; x < minesweeper.size; x++) {
            for (y = 0; y < minesweeper.size; y++) {

                if (minesweeper.grid[y][x] != '') {
                    continue;
                }

                minesweeper.grid[y][x] = minesweeper.countBombs(x, y);

            }
        }
    },

    countBombs: function(x, y) {
        var count = 0,
            canLeft = (x > 0),
            canRight = (x < minesweeper.size-1),
            canUp = (y > 0),
            canDown = (y < minesweeper.size-1);

        count += (canLeft && canUp && minesweeper.grid[y-1][x-1] === 'x')   ? 1 : 0;
        count += (canLeft && minesweeper.grid[y][x-1] === 'x')              ? 1 : 0;
        count += (canLeft && canDown && minesweeper.grid[y+1][x-1] === 'x') ? 1 : 0;
        count += (canUp && minesweeper.grid[y-1][x] === 'x')                ? 1 : 0;
        count += (canDown && minesweeper.grid[y+1][x] === 'x')              ? 1 : 0;
        count += (canRight && canUp && minesweeper.grid[y-1][x+1] === 'x')  ? 1 : 0;
        count += (canRight && minesweeper.grid[y][x+1] === 'x')             ? 1 : 0;
        count += (canRight && canDown && minesweeper.grid[y+1][x+1] === 'x')  ? 1 : 0;

        return count;
    },

    generateHTML: function() {
        var html = '';

        for (x = 0; x < minesweeper.size; x++) {
            for (y = 0; y < minesweeper.size; y++) {

                html += '<div class="block">'+minesweeper.grid[y][x]+'</div>';

            }

            html += '<div class="clearfix"></div>';
        }

        return html;
    }
};

$(document).ready(function() {
    minesweeper.newGame();

    console.log(minesweeper);
});