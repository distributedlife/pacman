'use strict';

var map = require('lodash').map;
var add = require('distributedlife-sat').vector.add;
var scale = require('distributedlife-sat').vector.scale;

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function setPositionToProxy (delta, state) {
  return map(state.unwrap('players'), function (player) {
    if (!player.pacman.moving) {
      return [];
    }

    return [
      p(player.id, 'pacman.position'), state.unwrap(p(player.id, 'pacman.proxy'))
    ];
  });
}

var define = require('ensemblejs/lib/define').default;

var directionToVelocity = {
  left:  {x: -1, y: 0},
  right: {x: +1, y: 0},
  up:    {x: 0, y: -1},
  down:  {x: 0, y: +1}
};

function movingHorizontally (direction) {
  return direction === 'left' || direction === 'right';
}

module.exports = {
  type: 'MovePlayer',
  deps: ['Config'],
  func: function Pacman (config) {

    function isGhost (role) {
      return role !== 'pacman';
    }

    function getSpeedOfPlayer (role) {
      var base = config().pacman.speeds.base;
      var modifier = config().pacman.speeds[isGhost(role) ? 'ghost' : 'pacman'];

      return base * modifier;
    }

    function snap (p) {
      return Math.round(p / 16) * 16;
    }

    function moveCollisionProxy (delta, state) {
      return map(state.unwrap('players'), function (player) {
        if (player.pacman.eatingTime > 0) {
          return [
            p(player.id, 'pacman.eatingTime'), player.pacman.eatingTime - delta
          ];
        }

        if (!player.pacman.moving) {
          return [];
        }

        var position = player.pacman.position;
        var velocity = directionToVelocity[player.pacman.direction];
        var speed = getSpeedOfPlayer(player.pacman.role);

        var newPosition = add(position, scale(velocity, speed * delta));

        if (movingHorizontally(player.pacman.direction)) {
          newPosition.y = snap(newPosition.y);
        } else {
          newPosition.x = snap(newPosition.x);
        }

        return [
          [p(player.id, 'pacman.proxy'), newPosition],
          [p(player.id, 'pacman.eatingTime'), 0]
        ];
      });
    }

    define('OnPhysicsFrame', function Pacman () {
      return setPositionToProxy;
    });

    define('OnPhysicsFrame', function Pacman () {
      return moveCollisionProxy;
    });
  }
};