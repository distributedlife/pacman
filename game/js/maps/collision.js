'use strict';

var reject = require('lodash').reject;
var map = require('lodash').map;
var nextRole = require('../logic/avatar-roles').nextRole;
var loader = require('../data/level-loader');

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

function updateHighestScore (delta, state, metadata) {
  var playerId = metadata.pacman.target.id;
  var score = state.get(p(playerId, 'pacman.score'));

  return [p(playerId, 'pacman.highestScore'), score];
}

function changePlaces (delta, state) {
  var players = state.unwrap('players');

  return map(players, function (player) {

    var role = nextRole(player.pacman.role, players.length);
    var position = loader(require('../data/map'))[role][0].position;
    var initialDirections = require('../logic/avatar-roles').initialDirections;

    return [
      [p(player.id, 'pacman.role'), role],
      [p(player.id, 'pacman.position'), position],
      [p(player.id, 'pacman.proxy'), position],
      [p(player.id, 'pacman.direction'), initialDirections[role]],
      [p(player.id, 'pacman.eatingTime'), 0],
      [p(player.id, 'pacman.moving'), false],
      [p(player.id, 'pacman.score'), 0]
    ];
  });
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

function scarySounds () {
  return ['pacman.ghostNear', true];
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
        {
          and: ['walls'], start: [resetProxyToAvatarPosition, stopMoving]
        },
      ],
      pacman: [
        {
          and: ['pellets'], start: [eatPellet, increaseScore(10), pauseToEat(1)]
        },
        {
          and: ['energisers'], start: [eatEnergiser, increaseScore(50), pauseToEat(3), reverseGhosts, frightenGhosts]
        },
        {
          and: ['ghosts'], start: [updateHighestScore, changePlaces]
        },
        {
          and: ['ghost-area'], start: [scarySounds]
        },
        {
          and: ['cell-gate'], start: [resetProxyToAvatarPosition, stopMoving]
        }
      ]
    };
  }
};