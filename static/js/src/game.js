;'use strict';

var _ = require('underscore'),
    player = require('./player');

var TicTacToe = (function($) {

    $(document).ready(function() {
        TicTacToe.init();
    });

    var _reset = function() {
        TicTacToe.resetControls.hide();
        TicTacToe.newGameControls.show();
        TicTacToe.board.removeClass('tie');
        TicTacToe.positions.html('').removeClass('selected win');

        var player1 = new player(),
            ai = new player('computer', true);

        TicTacToe.player = player1;
        TicTacToe.ai = ai;

        // humans first
        TicTacToe.activePlayer = TicTacToe.player;

        _play();
    };

    var _toggleActivePlayer = function() {
        TicTacToe.activePlayer = TicTacToe.activePlayer === TicTacToe.player ? TicTacToe.ai : TicTacToe.player;
    };

    var _markWinningCombination = function(combo) {
        for (var i = 0; i < combo.length; i++) {
            $('[data-position="' + combo[i] + '"]').addClass('win');
        }
    };

    var _markPosition = function(position) {
        var target = $('[data-position="' + position + '"]');

        // set position as selected and add icon
        target.addClass('selected').html(TicTacToe.sides[TicTacToe.activePlayer.side]);

        // add position to player's positions
        TicTacToe.activePlayer.positions.push(position);
        _checkWinner();
    };

    var _aiTurn = function() {
        // determine which winning combination has the shortest number of remaining
        // positions for the opponent. If there is a shortest one, that is the one
        // closest to victory, so choose an empty position from that combination.
        // If there is more than one with the same number of remaining positions,
        // pick one at random, as the actual position is irrelevant.

        var comboIntersections = {};

        _.each(TicTacToe.winningCombinations, function(combo) {
            var intersection = _.intersection(combo, TicTacToe.player.positions),
                comboIntersection = comboIntersections[intersection.length],
                difference = _.difference(combo, intersection, TicTacToe.ai.positions);

            if (difference.length > 0) {
                if (comboIntersection === undefined) {
                    comboIntersections[intersection.length] = [difference];
                }
                else {
                    comboIntersection.push(difference);
                }
            }
        });

        // get highest key of intersections, as that will be the array of the fewest
        // moves remaining to win for the player, then pick a random value from the
        // positions that would block the opposing player
        var keys = _.keys(comboIntersections),
            index = parseInt(keys.sort(function(a, b) { return a - b; })[keys.length - 1]),
            blockingPositions = _.flatten(_.difference(comboIntersections[index], TicTacToe.player.positions, TicTacToe.ai.positions)),
            aiNextPosition;

        // Pick at random. If the middle is available, choose it out of spite
        if (index === 1) {
            aiNextPosition = _.indexOf(blockingPositions, 5) > -1 ? 5 : _.sample(blockingPositions);
        }
        else {
            // block the shortest winning combo of the player
            aiNextPosition = blockingPositions[0];
        }

        // mark position and check for winner
        _markPosition(aiNextPosition);
    };

    var _checkWinner = function() {

        // compare activePlayer positions to winning combinations
        for (var i = 0; i < TicTacToe.winningCombinations.length; i++) {
            var combo = TicTacToe.winningCombinations[i];

            if (_.intersection(combo, TicTacToe.activePlayer.positions).length === 3) {
                TicTacToe.activePlayer.winner = true;
                _markWinningCombination(combo);
                break;
            }
        }

        // Tie
        if (TicTacToe.player.positions.length === 5 && TicTacToe.ai.positions.length === 5) {
            TicTacToe.board.addClass('tie');
        }

        if (!TicTacToe.activePlayer.winner) {

            _toggleActivePlayer();

            if (TicTacToe.activePlayer.isAI) {
                _aiTurn();
            }
        }
    };

    var _play = function() {

        // Choose side
        TicTacToe.newGameControls.find('.btn').on('click', function(e) {
            var target = $(e.currentTarget);
            TicTacToe.player.side = target.val();
            TicTacToe.ai.side = TicTacToe.player.side == 'x' ? 'o' : 'x';
            TicTacToe.resetControls.show();
            TicTacToe.newGameControls.hide();
        });

        // select position
        TicTacToe.positions.on('click', function(e) {
            var target = $(this);

            // if player has chosen a side and the space is available, mark it
            if (TicTacToe.player.side !== undefined && !target.hasClass('selected')) {
                _markPosition(target.data('position'));
            }
        });
    };

    var init = function() {
        // get available positions and clear the board
        TicTacToe.board = $('#board');
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
