define(['jquery', 'game/minesweeper'], function($, minesweeper) {

    // Spot chosen
    $(document).on('click', '#minesweeper a', function(e) {
        e.preventDefault();

        minesweeper.leftClick(this);

        return false;
    });

    // Bomb flagged
    $(document).on('contextmenu', '#minesweeper a', function(e) {
        e.preventDefault();

        minesweeper.rightClick(e.target);
    });


    $(document).ready(function() {
        // New game
        $('#new_game').click(function() {
            minesweeper.newGame( $('#difficulty').val() );
        });

        // Validate game
        $('#validate').click(function() {
            minesweeper.validate();
        });
    });
});