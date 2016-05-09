'use strict';

var loader = require('../data/level-loader');

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
  func: function pacman () {
    return function seedPlayerState (playerId) {
      return {
        pacman: {
          role: assignRole(playerId),
          score: 0,
          eatingTime: 0,
          moving: true,
          position: loader(require('../data/map'))['pacman-spawn'][0].position,
          direction: 'left',
          proxy: loader(require('../data/map'))['pacman-spawn'][0].position
        }
      };
    };
  }
};