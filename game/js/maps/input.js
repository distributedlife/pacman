'use strict';

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function up (state, input, data) {
  return [p(data.playerId, 'pacman.avatar.velocity.y'), -1];
}

function down (state, input, data) {
  return [p(data.playerId, 'pacman.avatar.velocity.y'), +1];
}

function left (state, input, data) {
  return [p(data.playerId, 'pacman.avatar.velocity.x'), -1];
}

function right (state, input, data) {
  return [p(data.playerId, 'pacman.avatar.velocity.x'), +1];
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