'use strict';

var map = require('lodash').map;
var add = require('distributedlife-sat').vector.add;
var scale = require('distributedlife-sat').vector.scale;

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function setPositionToGhost (delta, state) {
  return map(state.unwrap('players'), function (player) {
    return [
      p(player.id, 'pacman.avatar.position'), state.unwrap(p(player.id, 'pacman.avatar.ghost'))
    ];
  });
}

var define = require('ensemblejs/lib/define').default;

module.exports = {
  type: 'MovePlayer',
  deps: ['Config'],
  func: function Pacman (config) {

    function moveCollisionGhost (delta, state) {
      return map(state.unwrap('players'), function (player) {
        var position = player.pacman.avatar.position;
        var velocity = player.pacman.avatar.velocity;
        var speed = config().pacman.avatar.speed;

        var newPosition = add(position, scale(velocity, speed * delta));

        return [
          p(player.id, 'pacman.avatar.ghost'), newPosition
        ];
      });
    }

    define('OnPhysicsFrame', function Pacman () {
      return setPositionToGhost;
    });

    define('OnPhysicsFrame', function Pacman () {
      return moveCollisionGhost;
    });
  }
};