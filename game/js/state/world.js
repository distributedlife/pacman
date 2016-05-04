'use strict';

var levelLoader = require('../data/level-loader');
var map = require('lodash').map;

module.exports = {
  type: 'StateSeed',
  func: function Amazing () {
    var pellets = levelLoader(require('../data/map')).pellets;

    map(pellets, function (pellet) {
      pellet.eaten = false;
      return pellet;
    });

    return {
      pacman: {
        pellets: pellets,
      }
    };
  }
};