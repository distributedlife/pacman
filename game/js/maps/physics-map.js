'use strict';

var merge = require('lodash').merge;
var map = require('lodash').map;
var reject = require('lodash').reject;
var filter = require('lodash').filter;
var levelLoader = require('../data/level-loader');

var length = 15;

function avatar (player) {
  var avatar = {
    id: player.id,
    length: length
  };

  merge(avatar, player.pacman);

  avatar.position = {x: avatar.proxy.x, y: avatar.proxy.y};

  return avatar;
}

function makeGhostArea (ghost) {
  var area = {
    id: ghost.id,
    radius: length * 2
  };

  merge(area, ghost.pacman);

  area.position = {x: area.proxy.x, y: area.proxy.y};

  return area;
}

function ghosts (state) {
  return map(reject(state.players, {pacman: {role: 'pacman'}}), avatar);
}

function ghostArea (state) {
  return map(reject(state.players, {pacman: {role: 'pacman'}}), makeGhostArea);
}

function pacman (state) {
  return map(filter(state.players, {pacman: {role: 'pacman'}}), avatar);
}

module.exports = {
  type: 'PhysicsMap',
  func: function () {
    return {
      walls: levelLoader(require('../data/map')).walls,
      avatars: [{sourceKey: 'players', via: avatar}],
      pellets: ['pacman.pellets'],
      energisers: ['pacman.energisers'],
      ghosts: [ghosts],
      ghostArea: [ghostArea],
      pacman: [pacman]
    };
  }
};