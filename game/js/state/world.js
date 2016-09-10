'use strict';

const levelLoader = require('../data/level-loader');

module.exports = {
  type: 'StateSeed',
  func: function Amazing () {
    const pellets = levelLoader(require('../data/map')).pellet;
    const energisers = levelLoader(require('../data/map')).energisers;

    pellets.map(function (pellet) {
      pellet.eaten = false;
      return pellet;
    });

    energisers.map(function (pellet) {
      pellet.eaten = false;
      return pellet;
    });

    return {
      pacman: {
        pellets,
        energisers,
        frightenedDurationRemaining: 0,
        ghostNear: false
      }
    };
  }
};