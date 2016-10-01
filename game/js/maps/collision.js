'use strict';

import { unwrap } from 'ok-selector';
// var reject = require('lodash').reject;
// var nextRole = require('../logic/avatar-roles').nextRole;
// var loader = require('../data/level-loader');

// const p = (id, path) => `players:${id}.${path}`;

function resetProxyToAvatarPosition (delta, state, metadata) {
  const playerId = metadata.avatars.target.id;
  const position = unwrap(state, `players:${playerId}.pacman.position`);

  // console.log('resetProxyToAvatarPosition');

  return [`players:${playerId}.pacman.proxy`, position];
}

function stopMoving (delta, state, metadata) {
  const playerId = metadata.avatars.target.id;

  // console.log('stopMoving');

  return [`players:${playerId}.pacman.moving`, false];
}

// function eatPellet (delta, state, metadata) {
//   return ['pacman.pellets-', {id: metadata.pellets.target.id}];
// }

// function eatEnergiser (delta, state, metadata) {
//   return ['pacman.energisers-', {id: metadata.energisers.target.id}];
// }

// function increaseScore (amount) {
//   return function addToScore (delta, state, metadata) {
//     const playerId = metadata.pacman.target.id;
//     const score = state.get('players').find((player) => player.get('id') === playerId).get('pacman').get('score');

//     return [p(playerId, 'pacman.score'), score + amount];
//   };
// }

// function updateHighestScore (delta, state, metadata) {
//   var playerId = metadata.pacman.target.id;
//   var score = find(state.players, {id: playerId}).pacman.score;

//   return [p(playerId, 'pacman.highestScore'), score];
// }

// function changePlaces (delta, state) {
//   return map(state.players, function (player) {

//     var role = nextRole(player.pacman.role, state.players.length);
//     var position = loader(require('../data/map'))[role][0].position;
//     var initialDirections = require('../logic/avatar-roles').initialDirections;

//     return [
//       [p(player.id, 'pacman.role'), role],
//       [p(player.id, 'pacman.position'), position],
//       [p(player.id, 'pacman.proxy'), position],
//       [p(player.id, 'pacman.direction'), initialDirections[role]],
//       [p(player.id, 'pacman.eatingTime'), 0],
//       [p(player.id, 'pacman.moving'), false],
//       [p(player.id, 'pacman.score'), 0]
//     ];
//   });
// }

// const directionReverser = {
//   up: 'down',
//   down: 'up',
//   left: 'right',
//   right: 'left'
// };

// function reverseGhosts (delta, state) {
//   var ghosts = reject(state.players, { pacman: { role: 'pacman' } });

//   return map(ghosts, function (ghost) {
//     var direction = ghost.pacman.direction;

//     return [
//       p(ghost.id, 'pacman.direction'), directionReverser[direction]
//     ];
//   });
// }

// function scarySounds () {
//   return ['pacman.ghostNear', true];
// }

// const Score = {
//   Pellet: 10,
//   Energiser: 50
// };

module.exports = {
  type: 'CollisionMap',
  deps: ['Config'],
  func: function Pacman (config) {
    // function frightenGhosts () {
    //   return [
    //     'pacman.frightenedDurationRemaining', config().pacman.fright.duration
    //   ];
    // }

    return {
      avatars: [
        {
          and: ['walls'], start: [resetProxyToAvatarPosition, stopMoving]
        }
      ],
      // pacman: [
      //   {
      //     and: ['pellets'], start: [eatPellet, increaseScore(Score.Pellet)]
      //   },
      //   {
      //     and: ['energisers'], start: [eatEnergiser, increaseScore(Score.Energiser)]//, reverseGhosts, frightenGhosts]
      //   }
      // ]
    };
  }
};


/*
        {
          and: ['ghost-area'], start: [scarySounds]
        },
        {
          and: ['ghosts'], start: [updateHighestScore, changePlaces]
        },
        {
          and: ['cell-gate'], start: [resetProxyToAvatarPosition, stopMoving]
        }
      */