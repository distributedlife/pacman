'use strict';

import read, { unwrap } from 'ok-selector';
// const reject = require('lodash').reject;
const levelLoader = require('../data/level-loader');

const length = 15;

const mapAvatar = (player) => ({
  id: read(player, 'id'),
  length,
  ...unwrap(player, 'pacman'),
  position: unwrap(player, 'pacman.proxy')
});

// function makeGhostArea (ghost) {
//   var area = {
//     id: ghost.id,
//     radius: length * 2
//   };

//   merge(area, ghost.pacman);

//   area.position = {x: area.proxy.x, y: area.proxy.y};

//   return area;
// }

// function ghosts (state) {
//   return map(reject(state.players, {pacman: {role: 'pacman'}}), mapAvatar);
// }

// function ghostArea (state) {
//   return map(reject(state.players, {pacman: {role: 'pacman'}}), makeGhostArea);
// }

function pacman (state) {
  // console.log(state.get('players').filter((player) => player.get('pacman').get('role') === 'pacman'));
  // return state.get('players').filter((player) => player.get('pacman').get('role') === 'pacman').map(mapAvatar);
  return [];
  // return map(filter(state.get('players'), {pacman: {role: 'pacman'}}), mapAvatar);
}

module.exports = {
  type: 'PhysicsMap',
  func: () => ({
    walls: levelLoader(require('../data/map')).walls,
    avatars: [{sourceKey: 'players', via: mapAvatar}],
    // pellets: ['pacman.pellets'],
    // energisers: ['pacman.energisers'],
    // ghosts: [ghosts],
    // ghostArea: [ghostArea],
    // pacman: [pacman]
  })
};