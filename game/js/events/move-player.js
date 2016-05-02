'use strict';

var map = require('lodash').map;
var add = require('distributedlife-sat').vector.add;
var scale = require('distributedlife-sat').vector.scale;

function p(id, path) {
  return 'players:' + id + '.' + path;
}

module.exports = {
  type: 'OnPhysicsFrame',
  deps: ['Config'],
  func: function Pacman (config) {
    return function (delta, state) {
      return map(state.unwrap('players'), function (player) {
        var position = player.pacman.avatar.position;
        var velocity = player.pacman.avatar.velocity;
        var speed = config().pacman.avatar.speed;

        var newPosition = add(position, scale(velocity, speed * delta));

        return [
          p(player.id, 'pacman.avatar.position'), newPosition
        ];
      });
    };
  }
};