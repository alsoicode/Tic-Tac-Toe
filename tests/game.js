var assert = require('assert'),
    jsdom = require('mocha-jsdom'),
    _ = require('underscore');

describe('Tic Tac Toe functional tests', function() {

    var $;
    jsdom();

    before(function() {
        $ = require('jquery');
        window.jQuery = $;
        TicTacToe = require('../static/js/src/game');
    });

    beforeEach(function(done) {
        TicTacToe.reset();
        done();
    });

    describe('When initializing a new game', function() {

        it('Should assign players without errors', function(done) {
            assert(!TicTacToe.player.isAI);
            assert(TicTacToe.ai.isAI);
            assert.equal(TicTacToe.activePlayer, TicTacToe.player);
            assert.deepStrictEqual(TicTacToe.player.positions, []);
            assert.deepStrictEqual(TicTacToe.ai.positions, []);
            assert(!TicTacToe.player.winner);
            assert(!TicTacToe.ai.winner);

            done();
        });

    });

    describe('When resetting a game', function() {
        it('Should re-assign player data', function(done) {
            TicTacToe.player.positions = [1,2,3];
            TicTacToe.player.side = 'x';
            TicTacToe.player.winner = true;
            TicTacToe.ai.positions = [4,5,6,7];
            TicTacToe.ai.side = 'o';
            TicTacToe.reset();

            assert.deepStrictEqual(TicTacToe.player.positions, []);
            assert.equal(TicTacToe.player.side, null);
            assert(!TicTacToe.player.winner);
            assert.deepStrictEqual(TicTacToe.ai.positions, []);
            assert.equal(TicTacToe.ai.side, null);
            assert(!TicTacToe.ai.winner);

            done();
        });
    });

    describe('When checking for a winner, and the player has positions in the combos', function() {
        it('Should set the player as the winner', function(done) {
            _.each(TicTacToe.winningCombinations, function(winningCombo) {
                TicTacToe.player.positions = winningCombo;
                TicTacToe.checkWinner();
                assert(TicTacToe.player.winner);
                TicTacToe.reset();
            });

            done();
        });
    });

    describe('When checking for a winner and both players have exhausted all positions', function() {
        it('should indicate a tie', function(done) {
            TicTacToe.player.positions = [1, 2, 6, 7, 8];
            TicTacToe.ai.positions = [3, 4, 5, 9];
            TicTacToe.checkWinner();
            assert(!TicTacToe.player.winner);
            assert(!TicTacToe.ai.winner);

            done();
        });
    });

    describe('When the player selects his first position and it isn\'t the center', function() {
        it('should result in the AI picking the center position', function(done) {
            TicTacToe.player.positions.push(1);
            TicTacToe.checkWinner();
            assert.deepStrictEqual(TicTacToe.ai.positions, [5]);

            done();
        });
    });

    describe('When the player selects the middle position on their first turn', function() {
        it('Should result in the AI picking a spot at random', function(done) {
            TicTacToe.player.positions.push(5);
            TicTacToe.checkWinner();
            assert(TicTacToe.ai.positions.length > 0);
            assert(TicTacToe.ai.positions[0] !== 5);

            done();
        });
    });

    describe('When the player has two positions of a winning combo and the AI does not', function() {
        it('should result in the AI picking the blocking position', function(done) {

            _.each(TicTacToe.winningCombinations, function(combo) {
                for (var i = 0; i < combo.length; i++) {
                    TicTacToe.player.positions = _.without(combo, combo[i]);
                    TicTacToe.checkWinner();
                    assert.deepStrictEqual(TicTacToe.ai.positions, [combo[i]]);
                    TicTacToe.reset();
                }
            });

            done();
        });
    });

    describe('When the AI has two postions of a winning combo and the player does not', function() {
        it('should result in the AI choosing the winning position', function(done) {

            _.each(TicTacToe.winningCombinations, function(combo) {
                for (var i = 0; i < combo.length; i++) {
                    TicTacToe.ai.positions = _.without(combo, combo[i]);
                    TicTacToe.checkWinner();
                    assert.deepStrictEqual(_.difference(TicTacToe.ai.positions, combo), []);
                    TicTacToe.reset();
                }
            });

            done();
        });
    });

});
