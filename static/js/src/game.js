var _ = require('underscore');

var TicTacToe = (function($) {
    'use strict';

    $(document).ready(function() {
        TicTacToe.init();
    });

    var _reset = function() {
        TicTacToe.resetControls.hide();
        TicTacToe.newGameControls.show();
        TicTacToe.positions.html('').removeClass('selected');
        TicTacToe.player = {
            positions: [],
            winner: false
        };
        TicTacToe.ai = {
            positions: [],
            winner: false
        };
        TicTacToe.availablePositions = [9, 8, 7, 6, 5, 4, 3, 2, 1];
        TicTacToe.activePlayer = TicTacToe.player;

        _play();
    };

    var _toggleActivePlayer = function() {
        TicTacToe.activePlayer = TicTacToe.activePlayer === TicTacToe.player ? TicTacToe.ai : TicTacToe.player;
    };

    var _checkWinner = function() {

        // compare activePlayer positions to winning combinations
        _.each(TicTacToe.winningCombinations, function(combo) {

            console.log(TicTacToe.activePlayer.positions, combo);

            // console.log(_.intersection(combo, TicTacToe.activePlayer.positions).length);

            if (_.intersection(combo, TicTacToe.activePlayer.positions).length === 3) {
                TicTacToe.activePlayer.winner = true;
                alert('winner');
            }
        });
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
        TicTacToe.positions.on('click', function(e) {
            var target = $(this);

            // if player has chosen a side and the space is available, mark it
            if (TicTacToe.player.side !== undefined && !target.hasClass('selected')) {

                // set position as selected and add icon
                target.addClass('selected').html(TicTacToe.sides[TicTacToe.player.side]);

                // get position selected
                var selectedPosition = target.data('position')

                // Remove position from availablePositions
                TicTacToe.availablePositions = _.reject(TicTacToe.availablePositions, function(position) {
                    return position === selectedPosition;
                })

                // add position to player's positions
                TicTacToe.player.positions.push(selectedPosition);

                _checkWinner();

                // check for winner
            }
        });
    };

    var init = function() {
        // get available positions and clear the board
        TicTacToe.positions = $('#board td');

        TicTacToe.winningCombinations = [
            // horizontal
            [1, 2, 3], [4, 5, 6], [7, 8, 9],

            // vertical
            [1, 4, 7], [2, 5, 8], [3, 6, 9],

            // diagonal
            [1, 5, 9], [3, 5, 7]
        ];
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
