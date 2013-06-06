define(['jquery', 'lodash', 'reactor', 'game/settings'], function($, _, Reactor, settings) {

    // User handlebars-style variables in templates
    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
    };


    return _.extend({}, settings.defaults, {

        newGame: function(difficulty) {
            minesweeper = this;

            this.difficulty = difficulty || 'easy';
            this.size = settings.difficulties[this.difficulty].size;
            this.bombs = settings.difficulties[this.difficulty].bombs;
            this.flags = Signal( this.bombs );
            this.timer = Signal(0);

            // Increment timer
            this.interval = setInterval(function() { minesweeper.timer( minesweeper.timer() + 1 ) }, 1000);

            // Use Reactor to update the flag counts
            Observer(function() {
                document.getElementById('timer').innerHTML = minesweeper.timer();
                document.getElementById('flag_count').innerHTML = minesweeper.flags();
            });

            this.makeBoard();
        },

        validate: function() {
            clearInterval( this.interval );

            // Display all mines
            for (y = 0; y < this.size; y++) {
                for (x = 0; x < this.size; x++) {

                    if (this.grid[y][x].isBomb && !this.grid[y][x].flagged) {
                        this.explode();

                        return;
                    }

                }
            }

            alert('You win!!');
        },

        explode: function() {
            clearInterval( this.interval );

            // Display all mines
            for (y = 0; y < this.size; y++) {
                for (x = 0; x < this.size; x++) {

                    if (this.grid[y][x].isBomb) {

                        $('[data-x="' + x + '"][data-y="' + y + '"]').html('x');

                    } else if (this.grid[y][x].flagged) {

                        $('[data-x="' + x + '"][data-y="' + y + '"]').addClass('error');

                    }

                }
            }

            // initialize();
            alert('boom');
        },

        makeBoard: function() {
            var i, j;

            this.grid = new Array();

            for (i = 0; i < this.size; i++) {
                this.grid[i] = new Array();

                for (j = 0; j < this.size; j++) {

                    this.grid[i][j] = {
                        value: 0,
                        revealed: false,
                        flagged: false,
                        isBomb: false
                    };

                }
            }

            for (i = 0; i < this.bombs; i++) {
                this.placeBomb();
            }

            this.populateBoard();

            document.getElementById('minesweeper').innerHTML = this.generateHTML();
        },

        placeBomb: function() {
            var x, y;

            x = _.random(0, this.size-1);
            y = _.random(0, this.size-1);

            if (this.grid[y][x].isBomb && this.infiniteLoop < (Math.pow(this.size, 2))) {

                this.infiniteLoop++;
                this.placeBomb();

            } else {

                this.infiniteLoop = 0;
                this.grid[y][x].isBomb = true;

            }
        },

        populateBoard: function() {
            for (x = 0; x < this.size; x++) {
                for (y = 0; y < this.size; y++) {

                    if (this.grid[y][x].isBomb) {
                        continue;
                    }

                    this.grid[y][x].value = this.countBombs(x, y);

                }
            }
        },

        countBombs: function(x, y) {
            var count = 0,
                canLeft = (x > 0),
                canRight = (x < this.size-1),
                canUp = (y > 0),
                canDown = (y < this.size-1);

            count += (canLeft && canUp && this.grid[y-1][x-1].isBomb)       ? 1 : 0;
            count += (canLeft && this.grid[y][x-1].isBomb)                  ? 1 : 0;
            count += (canLeft && canDown && this.grid[y+1][x-1].isBomb)     ? 1 : 0;
            count += (canUp && this.grid[y-1][x].isBomb)                    ? 1 : 0;
            count += (canDown && this.grid[y+1][x].isBomb)                  ? 1 : 0;
            count += (canRight && canUp && this.grid[y-1][x+1].isBomb)      ? 1 : 0;
            count += (canRight && this.grid[y][x+1].isBomb)                 ? 1 : 0;
            count += (canRight && canDown && this.grid[y+1][x+1].isBomb)    ? 1 : 0;

            return count;
        },

        generateHTML: function() {
            var html = '',
                template = _.template('<a href="" class="block" data-x="{{x}}" data-y="{{y}}">{{value}}</a>');

            for (y = 0; y < this.size; y++) {
                for (x = 0; x < this.size; x++) {

                    html += template({
                        x: x,
                        y: y,
                        value: '&nbsp;'
                    });

                }

                html += '<div class="clearfix"></div>';
            }

            return html;
        },

        leftClick: function(block) {
            var x, y;

            x = Number($(block).data('x'));
            y = Number($(block).data('y'));

            this.grid[y][x].flagged = false;

            if (this.grid[y][x].isBomb) {

                this.explode();

            } else if (this.grid[y][x].value > 0) {

                $(block).html( this.grid[y][x].value );

            } else {

                this.zeroSpot(x, y);

            }
        },

        rightClick: function(block) {
            var x, y;

            // You've used all of the flags!
            if (this.flags() === 0) {
                alert('You have run out of flags. Are you sure you marked the bombs correctly?');
                return;
            };

            x = Number($(block).data('x'));
            y = Number($(block).data('y'));

            if (this.grid[y][x].flagged) {

                this.flags( this.flags() + 1 );
                $(block).html('&nbsp;');

            } else {

                this.flags( this.flags() - 1 );
                $(block).html('F');

            }

            this.grid[y][x].flagged = !this.grid[y][x].flagged;
        },

        zeroSpot: function(x, y) {
            var canLeft = (x > 0),
                canRight = (x < this.size-1),
                canUp = (y > 0),
                canDown = (y < this.size-1);

            if (!this.grid[y][x].revealed && !this.grid[y][x].flagged) {

                this.grid[y][x].revealed = true;

                if (this.grid[y][x].value > 0) {

                    $('[data-x="' + x + '"][data-y="' + y + '"]').html( this.grid[y][x].value );

                } else {

                    $('[data-x="' + x + '"][data-y="' + y + '"]').addClass('marked');

                    if (canLeft && canUp) {
                        this.zeroSpot(x-1, y-1);
                    }

                    if (canLeft) {
                        this.zeroSpot(x-1, y);
                    }

                    if (canLeft && canDown) {
                        this.zeroSpot(x-1, y+1);
                    }

                    if (canUp) {
                        this.zeroSpot(x, y-1);
                    }

                    if (canDown) {
                        this.zeroSpot(x, y+1);
                    }

                    if (canRight && canUp) {
                        this.zeroSpot(x+1, y-1);
                    }

                    if (canRight) {
                        this.zeroSpot(x+1, y);
                    }

                    if (canRight && canDown) {
                        this.zeroSpot(x+1, y+1);
                    }
                }
            }
        }
    });
});