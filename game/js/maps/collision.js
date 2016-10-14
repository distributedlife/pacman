'use strict';

import read, { unwrap } from 'ok-selector';
const nextRole = require('../logic/avatar-roles').nextRole;
const loader = require('../data/level-loader');

function resetProxyToAvatarPosition (delta, state, metadata) {
  const playerId = metadata.avatars.target.id;
  const position = unwrap(state, `players:${playerId}.pacman.position`);

  return [`players:${playerId}.pacman.proxy`, position];
}

function stopMoving (delta, state, metadata) {
  const playerId = metadata.avatars.target.id;

  return [`players:${playerId}.pacman.moving`, false];
}

function eatPellet (delta, state, metadata) {
  return ['pacman.pellets-', {id: metadata.pellets.target.id}];
}

function eatEnergiser (delta, state, metadata) {
  return ['pacman.energisers-', {id: metadata.energisers.target.id}];
}

function increaseScore (amount) {
  const addAmountToCurrentScore = (current) => current + amount;

  return function addToScore (delta, state, metadata) {
    return [`players:${metadata.pacman.target.id}.pacman.score`, addAmountToCurrentScore];
  };
}

function updateHighestScore (delta, state, metadata) {
  const playerId = metadata.pacman.target.id;
  const score = read(state, 'players:${playerId}.pacman.score');

  return [`players:${playerId}.pacman.highestScore`, score];
}

function changePlaces (delta, state) {
  const players = read(state, 'players');

  return players.map((player) => {
    const role = nextRole(read(player, 'pacman.role'), players.length);
    const position = loader(require('../data/map'))[role][0].position;
    const initialDirections = require('../logic/avatar-roles').initialDirections;

    const playerId = read(player, 'id');

    return [
      [`players:${playerId}.pacman.role`, role],
      [`players:${playerId}.pacman.position`, position],
      [`players:${playerId}.pacman.proxy`, position],
      [`players:${playerId}.pacman.direction`, initialDirections[role]],
      [`players:${playerId}.pacman.eatingTime`, 0],
      [`players:${playerId}.pacman.moving`, false],
      [`players:${playerId}.pacman.score`, 0]
    ];
  });
}

const directionReverser = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

const playerIsNotPacman = (player) => read(player, 'pacman.role') !== 'pacman';

function reverseGhosts (delta, state) {
  const ghosts = read(state, 'players').filter(playerIsNotPacman);

  return ghosts.map((ghost) => [
    `players:${read(ghost, 'id')}.pacman.direction`, directionReverser[read(ghost, 'pacman.direction')]
  ]);
}

function scarySounds () {
  console.log('woooooooo');
  return ['pacman.ghostNear', true];
}

const Score = {
  Pellet: 10,
  Energiser: 50
};

module.exports = {
  type: 'CollisionMap',
  deps: ['Config'],
  func: function Pacman (config) {
    function frightenGhosts () {
      return ['pacman.frightenedDurationRemaining', config().pacman.fright.duration];
    }

    return {
      avatars: [
        {
          and: ['walls'],
          start: [resetProxyToAvatarPosition, stopMoving]
        }
      ],
      pacman: [
        {
          and: ['cell-gate'],
          start: [resetProxyToAvatarPosition, stopMoving]
        },
        {
          and: ['ghost-area'],
          start: [scarySounds]
        },
        {
          and: ['ghosts'],
          start: []
        },
        {
          and: ['pellets'],
          start: [eatPellet, increaseScore(Score.Pellet)]
        },
        {
          and: ['energisers'],
          start: [eatEnergiser, increaseScore(Score.Energiser), frightenGhosts]
        }
      ]
    };
  }
};