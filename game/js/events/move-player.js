'use strict';

import read, { unwrap } from 'ok-selector';
const add = require('distributedlife-sat').vector.add;
const scale = require('distributedlife-sat').vector.scale;
const define = require('ensemblejs/lib/define').default;

const NodeSize = 16;
const Zero = 0;
const directionToVelocity = {
  left:  {x: -1, y:  0},
  right: {x:  1, y:  0},
  up:    {x:  0, y: -1},
  down:  {x:  0, y:  1}
};

function setPositionToProxy (delta, state) {
  return read(state, 'players').map(function (player) {
    if (!read(player, 'pacman.moving')) {
      return [];
    }

    return [`players:${read(player, 'id')}.pacman.position`, unwrap(player, 'pacman.proxy')];
  });
}

const isMovingHorizontally = (direction) => direction === 'left' || direction === 'right';
const isGhost = (role) => role !== 'pacman';
const snap = (position) => Math.round(position / NodeSize) * NodeSize;

module.exports = {
  type: 'MovePlayer',
  deps: ['Config'],
  func: function Pacman (config) {

    function getSpeedOfPlayer (role) {
      const base = config().pacman.speeds.base;
      const modifier = config().pacman.speeds[isGhost(role) ? 'ghost' : 'pacman'];

      return base * modifier;
    }

    function moveCollisionProxy (delta, state) {
      return read(state, 'players').map(function (player) {
        const playerId = read(player, 'id');

        if (read(player, 'pacman.eatingTime') > Zero) {
          return [
            `players:${playerId}.pacman.eatingTime`, read(player, 'pacman.eatingTime') - delta
          ];
        }

        if (!read(player, 'pacman.moving')) {
          return [];
        }

        const currentDirection = read(player, 'pacman.direction');
        const position = unwrap(player, 'pacman.position');
        const velocity = directionToVelocity[currentDirection];
        const speed = getSpeedOfPlayer(read(player, 'pacman.role'));

        const newPosition = add(position, scale(velocity, speed * delta));

        if (isMovingHorizontally(currentDirection)) {
          newPosition.y = snap(newPosition.y);
        } else {
          newPosition.x = snap(newPosition.x);
        }

        return [
          [`players:${playerId}.pacman.proxy`, newPosition],
          [`players:${playerId}.pacman.eatingTime`, Zero]
        ];
      });
    }

    define('OnPhysicsFrame', () => setPositionToProxy);
    define('OnPhysicsFrame', () => moveCollisionProxy);
  }
};