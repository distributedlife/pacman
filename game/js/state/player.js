'use strict';

var levelLoader = require('../data/level-loader');

var roles = ['pacman', 'blinky', 'pinky', 'inky', 'clyde'];

function assignRole (playerId) {
  if (playerId >= roles.length) {
    return 'waiting';
  }

  return roles[playerId];
}

module.exports = {
  type: 'PlayerStateSeed',
  deps: ['Config'],
  func: function Amazing () {

    return function seedPlayerState (playerId) {
      return {
        pacman: {
          role: assignRole(playerId),
          avatar: {
            position: levelLoader(require('../data/map')).spawn[0],
            velocity: {x: -1, y: 0},
            blocked: [],
            ghost: levelLoader(require('../data/map')).spawn[0]
          }
        }
      };
    };
  }
};