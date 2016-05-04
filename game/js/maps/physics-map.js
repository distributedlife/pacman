'use strict';

var merge = require('lodash').merge;
var levelLoader = require('../data/level-loader');

var length = 8;
var offset = length / 2;

function avatar (player) {
  var avatar = {
    id: player.id,
    length: length
  };

  merge(avatar, player.pacman.avatar);

  avatar.position = {x: avatar.ghost.x - offset, y: avatar.ghost.y - offset};

  return avatar;
}

module.exports = {
  type: 'PhysicsMap',
  func: function () {
    return {
      walls: levelLoader(require('../data/map')).walls,
      avatars: [{ sourceKey: 'players', via: avatar }],
      pellets: ['pacman.pellets']
    };
  }
};