'use strict';

var levelLoader = require('../data/level-loader');

var roles = ['pacman', 'blinky', 'pinky', 'inky', 'clyde'];

function assignRole (playerId) {
  if ((playerId - 1) >= roles.length) {
    return 'waiting';
  }

  return roles[playerId - 1];
}

module.exports = {
  type: 'PlayerStateSeed',
  deps: ['Config'],
  func: function Amazing () {

    return function seedPlayerState (playerId) {
      return {
        pacman: {
          role: assignRole(playerId),
          score: 0,
          frozenTurns: 0,
          avatar: {
            position: levelLoader(require('../data/map')).spawn[0],
            velocity: {x: -1, y: 0},
            ghost: levelLoader(require('../data/map')).spawn[0]
          }
        }
      };
    };
  }
};