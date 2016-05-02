'use strict';

var merge = require('lodash').merge;
var levelLoader = require('../data/level-loader');

function avatar (player) {
  var avatar = {
    id: player.id,
    length: 8
  };

  merge(avatar, player.pacman.avatar);

  return avatar;
}

module.exports = {
  type: 'PhysicsMap',
  func: function () {
    return {
      walls: levelLoader(require('../data/map')).walls,
      avatars: [{ sourceKey: 'players', via: avatar}]
    };
  }
};