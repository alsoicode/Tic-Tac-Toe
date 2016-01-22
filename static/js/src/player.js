;'use strict';

var Player = function(name, isAI) {
    this.fullName = name || 'Player 1';
    this.isAI = isAI || false;
    this.positions = [];
    this.side = null;
    this.winner = false;
};

module.exports = Player;
