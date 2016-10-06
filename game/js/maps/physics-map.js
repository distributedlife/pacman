'use strict';

import read, { unwrap } from 'ok-selector';
const levelLoader = require('../data/level-loader');

const length = 15;

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

const ghosts = (s) => read(s, 'players').filter((p) => read(p, 'pacman.role') !== 'pacman');
const pacman = (s) => read(s, 'players').filter((p) => read(p, 'pacman.role') === 'pacman');

module.exports = {
  type: 'PhysicsMap',
  func: () => ({
    walls: levelLoader(require('../data/map')).walls,
    avatars: [{sourceKey: 'players', via: avatar}],
    pellets: ['pacman.pellets'],
    energisers: ['pacman.energisers'],
    ghosts: [{sourceKey: ghosts, via: avatar}],
    ghostArea: [{sourceKey: ghosts, via: ghostArea }],
    pacman: [{sourceKey: pacman, via: avatar}]
  })
};