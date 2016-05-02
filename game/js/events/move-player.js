'use strict';

var map = require('lodash').map;
var add = require('distributedlife-sat').vector.add;
var scale = require('distributedlife-sat').vector.scale;

function p(id, path) {
  return 'players:' + id + '.' + path;
}

module.exports = {
  type: 'MovePlayer',
  deps: ['Config', 'DefinePlugin'],
  func: function Pacman (config, define) {

    define()('OnPhysicsFrame', function Pacman () {
      return function setPositionToGhost (delta, state) {
        return map(state.unwrap('players'), function (player) {
          return [
            p(player.id, 'pacman.avatar.position'), state.unwrap(p(player.id, 'pacman.avatar.ghost'))
          ];
        });
      };
    });

    define()('OnPhysicsFrame', function Pacman () {
      return function moveCollisionGhost (delta, state) {
        return map(state.unwrap('players'), function (player) {
          var position = player.pacman.avatar.position;
          var velocity = player.pacman.avatar.velocity;
          var speed = config().pacman.avatar.speed;

          var newPosition = add(position, scale(velocity, speed * delta));

          return [
            p(player.id, 'pacman.avatar.ghost'), newPosition
          ];
        });
      };
    });
  }
};