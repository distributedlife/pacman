'use strict';

var loader = require('../data/level-loader');
var assignRole = require('../logic/avatar-roles').assignRole;
var initialDirections = require('../logic/avatar-roles').initialDirections;

module.exports = {
  type: 'PlayerStateSeed',
  deps: ['Config'],
  func: function pacman () {
    return function seedPlayerState (playerId) {
      var role = assignRole(playerId);

      return {
        pacman: {
          role: role,
          score: 0,
          highestScore: 0,
          eatingTime: 0,
          moving: true,
          position: loader(require('../data/map'))[role][0].position,
          direction: initialDirections[role],
          proxy: loader(require('../data/map'))[role][0].position
        }
      };
    };
  }
};