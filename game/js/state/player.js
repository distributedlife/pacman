'use strict';

var levelLoader = require('../data/level-loader');

module.exports = {
  type: 'PlayerStateSeed',
  deps: ['Config'],
  func: function Amazing () {

    return function seedPlayerState () {
      return {
        pacman: {
          role: 'pacman',
          avatar: {
            position: levelLoader(require('../data/map')).spawn[0],
            velocity: {x: -1, y: 0},
          }
        }
      };
    };
  }
};