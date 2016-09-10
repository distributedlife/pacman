'use strict';

const p = (id, path) => `players:${id}.${path}`;

function up (state, input, data) {
  return [
    [p(data.playerId, 'pacman.direction'), 'up'],
    [p(data.playerId, 'pacman.moving'), true]
  ];
}

function down (state, input, data) {
  return [
    [p(data.playerId, 'pacman.direction'), 'down'],
    [p(data.playerId, 'pacman.moving'), true]
  ];
}

function left (state, input, data) {
  return [
    [p(data.playerId, 'pacman.direction'), 'left'],
    [p(data.playerId, 'pacman.moving'), true]
  ];
}

function right (state, input, data) {
  return [
    [p(data.playerId, 'pacman.direction'), 'right'],
    [p(data.playerId, 'pacman.moving'), true]
  ];
}

module.exports = {
  type: 'ActionMap',
  func: function Pacman () {
    return {
      up: [{ call: up }],
      down: [{ call: down }],
      left: [{ call: left }],
      right: [{ call: right }]
    };
  }
};