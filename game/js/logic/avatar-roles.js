'use strict';

const roles = ['pacman', 'blinky', 'pinky', 'inky', 'clyde'];
export const initialDirections = {
  pacman: 'left',
  blinky: 'left',
  pinky: 'up',
  inky: 'up',
  clyde: 'up'
};

export function assignRole (playerId) {
  if ((playerId - 1) >= roles.length) {
    return 'waiting';
  }

  return roles[playerId - 1];
}

export function nextRole (role, playerCount) {
  const index = roles.indexOf(role);

  return (index === 0) ? roles[playerCount - 1] : roles[index - 1];
}