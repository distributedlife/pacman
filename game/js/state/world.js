'use strict';

const levelLoader = require('../data/level-loader');

module.exports = {
  type: 'StateSeed',
  func: function Amazing () {
    let pellets = levelLoader(require('../data/map')).pellet;
    const energisers = levelLoader(require('../data/map')).energisers;

    pellets.map(function (pellet) {
      pellet.eaten = false;
      return pellet;
    });

    pellets = pellets.filter(() => Math.random() * 100 < 25);

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