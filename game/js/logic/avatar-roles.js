'use strict';

var roles = ['pacman', 'blinky', 'pinky', 'inky', 'clyde'];

function assignRole (playerId) {
  if ((playerId - 1) >= roles.length) {
    return 'waiting';
  }

  return roles[playerId - 1];
}

function nextRole (role, playerCount) {
  var index = roles.indexOf(role);

  return (index === 0) ? roles[playerCount - 1] : roles[index - 1];
}

var initialDirections = {
  pacman: 'left',
  blinky: 'left',
  pinky: 'up',
  inky: 'up',
  clyde: 'up'
};


module.exports = {
  assignRole: assignRole,
  nextRole: nextRole,
  initialDirections: initialDirections
};