'use strict';

var reject = require('lodash').reject;
var map = require('lodash').map;

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function resetProxyToAvatarPosition (delta, state, metadata) {
  var playerId = metadata.avatars.target.id;
  var position = state.unwrap(p(playerId, 'pacman.position'));

  return [p(playerId, 'pacman.proxy'), position];
}

function stopMoving (delta, state, metadata) {
  var playerId = metadata.avatars.target.id;

  return [p(playerId, 'pacman.moving'), false];
}

function eatPellet (delta, state, metadata) {
  return ['pacman.pellets-', {id: metadata.pellets.target.id}];
}

function eatEnergiser (delta, state, metadata) {
  return ['pacman.energisers-', {id: metadata.energisers.target.id}];
}

function increaseScore (amount) {
  return function addToScore (delta, state, metadata) {
    var playerId = metadata.pacman.target.id;
    var score = state.get(p(playerId, 'pacman.score'));

    return [p(playerId, 'pacman.score'), score + amount];
  };
}

function pauseToEat (duration) {
  return function pauseAvatar (delta, state, metadata) {
    return [p(metadata.pacman.target.id, 'pacman.eatingTime'), duration / 60];
  };
}

function die () {
  console.log('die');
}

var directionReverser = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

function reverseGhosts (delta, state) {
  var ghosts = reject(state.unwrap('players'), { pacman: { role: 'pacman' } });

  return map(ghosts, function (ghost) {
    var direction = ghost.pacman.direction;

    return [
      p(ghost.id, 'pacman.direction'), directionReverser[direction]
    ];
  });
}

module.exports = {
  type: 'CollisionMap',
  deps: ['Config'],
  func: function Pacman (config) {
    function frightenGhosts () {
      return [
        'pacman.frightenedDurationRemaining', config().pacman.fright.duration
      ];
    }

    return {
      avatars: [
        { and: ['walls'], start: [
          resetProxyToAvatarPosition, stopMoving
        ] },
      ],
      pacman: [
        {
          and: ['pellets'], start: [
            eatPellet, increaseScore(10), pauseToEat(1)
          ]
        },
        {
          and: ['energisers'], start: [
            eatEnergiser, increaseScore(50), pauseToEat(3), reverseGhosts, frightenGhosts
          ]
        },
        { and: ['ghosts'], start: [die] }
      ]
    };
  }
};