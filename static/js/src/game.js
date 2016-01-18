var TicTacToe = (function($) {
    'use strict';

    $(document).ready(function() {
        TicTacToe.init();
    });

    var _reset = function() {
        TicTacToe.resetControls.hide();
        TicTacToe.newGameControls.show();
        TicTacToe.availablePositions.html('').removeClass('selected');
        TicTacToe.player = {
            positions: []
        };

        _play();
    };

    var _play = function() {

        // Choose side
        TicTacToe.newGameControls.find('.btn').on('click', function(e) {
            var target = $(e.currentTarget);
            TicTacToe.player.side = target.val();
            TicTacToe.resetControls.show();
            TicTacToe.newGameControls.hide();
        });

        // select position
        TicTacToe.availablePositions.on('click', function(e) {
            var target = $(this);

            // if player has chosen a side and the space is available, mark it
            if (TicTacToe.player.side !== undefined && !target.hasClass('selected')) {
                target.addClass('selected').html(TicTacToe.sides[TicTacToe.player.side]);

                // check for winner
            }
        });
    };

    var init = function() {
        // get available positions and clear the board
        TicTacToe.availablePositions = $('#board td');
        TicTacToe.newGameControls = $('.new-game-controls');
        TicTacToe.resetControls = $('.reset-controls');
        TicTacToe.sides = {
            x: '<i class="fa fa-remove"></i>',
            o: '<i class="fa fa-circle-o"></i>'
        };

        TicTacToe.resetControls.find('.btn').on('click', function() {
            _reset();
        });

        _reset();
    };

    return {
        init: init
    };

})(window.jQuery);
