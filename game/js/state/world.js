'use strict';

var levelLoader = require('../data/level-loader');
var map = require('lodash').map;

module.exports = {
  type: 'StateSeed',
  func: function Amazing () {
    var pellets = levelLoader(require('../data/map')).pellet;
    var energisers = levelLoader(require('../data/map')).energisers;

    map(pellets, function (pellet) {
      pellet.eaten = false;
      return pellet;
    });

    map(energisers, function (pellet) {
      pellet.eaten = false;
      return pellet;
    });

    return {
      pacman: {
        pellets: pellets,
        energisers: energisers,
        frightenedDurationRemaining: 0,
        ghostNear: false
      }
    };
  }
};