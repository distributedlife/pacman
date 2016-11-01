import define from 'ensemblejs/lib/define';
// import { config } from 'ensemblejs/lib';

import read, { unwrap } from 'ok-selector';
const loader = require('../data/level-loader');
import { assignRole, nextRole, initialDirections } from '../logic/avatar-roles';

const energisers = loader(require('../data/map')).energisers;
const pellets = loader(require('../data/map')).pellet;
const walls = loader(require('../data/map')).walls

const add = require('distributedlife-sat').vector.add;
const scale = require('distributedlife-sat').vector.scale;

const NodeSize = 16;
const Zero = 0;
const directionToVelocity = {
  left:  {x: -1, y:  0},
  right: {x:  1, y:  0},
  up:    {x:  0, y: -1},
  down:  {x:  0, y:  1}
};

const length = 15;

define('PlayerStateSeed', () => {
  return (playerId) => {
    const role = assignRole(playerId);
    return {
      pacman: {
        role,
        score: 0,
        highestScore: 0,
        eatingTime: 0,
        moving: true,
        position: loader(require('../data/map'))[role][0].position,
        direction: initialDirections[role],
        proxy: loader(require('../data/map'))[role][0].position
      }
    }
  };
});

define('StateSeed', () => ({
  pacman: {
    pellets: pellets.map((pellet) => ({ ...pellet, eaten: false })).filter(() => Math.random() * 100 < 25),
    energisers: energisers.map((pellet) => ({ ...pellet, eaten: false })),
    frightenedDurationRemaining: 0,
    ghostNear: false
  }
}))

const startMoving = (state, input, data) => ([`players:${data.playerId}.pacman.moving`, true]);
const up = (state, input, data) => ([`players:${data.playerId}.pacman.direction`, 'up']);
const down = (state, input, data) => ([`players:${data.playerId}.pacman.direction`, 'down']);
const left = (state, input, data) => ([`players:${data.playerId}.pacman.direction`, 'left']);
const right = (state, input, data) => ([`players:${data.playerId}.pacman.direction`, 'right']);

define('ActionMap', () => ({
  up: [{ call: [up, startMoving] }],
  down: [{ call: [down, startMoving] }],
  left: [{ call: [left, startMoving] }],
  right: [{ call: [right, startMoving] }]
}));

const avatar = (player) => ({
  id: read(player, 'id'),
  length,
  ...unwrap(player, 'pacman'),
  position: unwrap(player, 'pacman.proxy')
});

const ghostArea = (ghost) => ({
  id: ghost.id,
  radius: length * 2,
  ...unwrap(ghost, 'pacman'),
  position: unwrap(ghost, 'pacman.proxy')
});

const onlyGhosts = (s) => read(s, 'players').filter((p) => read(p, 'pacman.role') !== 'pacman');
const onlyPacman = (s) => read(s, 'players').filter((p) => read(p, 'pacman.role') === 'pacman');

define('PhysicsMap', () => ({
  walls ,
  avatars: [{sourceKey: 'players', via: avatar}],
  pellets: ['pacman.pellets'],
  energisers: ['pacman.energisers'],
  ghosts: [{sourceKey: onlyGhosts, via: avatar}],
  ghostArea: [{sourceKey: onlyGhosts, via: ghostArea }],
  pacman: [{sourceKey: onlyPacman, via: avatar}]
}));

function resetProxyToAvatarPosition (delta, state, metadata) {
  const position = unwrap(state, `players:${metadata.avatars.target.id}.pacman.position`);

  return [`players:${metadata.avatars.target.id}.pacman.proxy`, position];
}

function stopMoving (delta, state, metadata) {
  return [`players:${metadata.avatars.target.id}.pacman.moving`, false];
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

define('CollisionMap', ['Config'], (config) => {
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
});




function setPositionToProxy (delta, state) {
  return read(state, 'players').map(function (player) {
    if (!read(player, 'pacman.moving')) {
      return [];
    }

    const position = unwrap(player, 'pacman.proxy');

    return [`players:${read(player, 'id')}.pacman.position`, position];
  });
}

const isMovingHorizontally = (direction) => direction === 'left' || direction === 'right';
const isGhost = (role) => role !== 'pacman';
const snap = (position) => Math.round(position / NodeSize) * NodeSize;

define('MovePlayer', ['Config'], (config) => {
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
      const oldPosition = unwrap(player, 'pacman.proxy');
      const velocity = directionToVelocity[currentDirection];
      const speed = getSpeedOfPlayer(read(player, 'pacman.role'));

      const newPosition = add(oldPosition, scale(velocity, speed * delta));

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
});