'use strict';

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function up (state, input, data) {
  return [p(data.playerId, 'Pacman.avatar.velocity'), {x: 0, y: -1}];
}

function down (state, input, data) {
  return [p(data.playerId, 'Pacman.avatar.velocity'), {x: 0, y: +1}];
}

function left (state, input, data) {
  return [p(data.playerId, 'Pacman.avatar.velocity'), {x: -1, y: 0}];
}

function right (state, input, data) {
  return [p(data.playerId, 'Pacman.avatar.velocity'), {x: +1, y: 0}];
}

module.exports = {
  type: 'ActionMap',
  func: function Pacman () {
    return {
      up: [ {call: up, onRelease: true} ],
      down: [ {call: down, onRelease: true} ],
      left: [ {call: left, onRelease: true} ],
      right: [ {call: right, onRelease: true} ]
    };
  }
};