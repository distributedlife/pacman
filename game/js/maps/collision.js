'use strict';

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function resetGhostToAvatarPosition (delta, state, metadata) {
  var playerId = metadata.avatars.target.id;
  var position = state.unwrap(p(playerId, 'pacman.avatar.position'));

  return [
    [p(playerId, 'pacman.avatar.ghost'), position],
    [p(playerId, 'pacman.avatar.velocity'), {x: 0, y: 0}]
  ];
}

function eatPellet (delta, state, metadata) {
  return ['pacman.pellets-', {id: metadata.pellets.target.id}];
}

function increaseScore (delta, state, metadata) {
  var playerId = metadata.avatars.target.id;
  var score = state.get(p(playerId, 'pacman.score'));

  return [p(playerId, 'pacman.score'), score + 10];
}

function stopAndEat (delta, state, metadata) {
  return [p(metadata.avatars.target.id, 'pacman.frozenTurns'), 3];
}

module.exports = {
  type: 'CollisionMap',
  func: function Pacman () {
    return {
      'avatars': [
        { and: ['walls'], start: [resetGhostToAvatarPosition] },
        { and: ['pellets'], start: [eatPellet, increaseScore, stopAndEat]}
      ]
    };
  }
};