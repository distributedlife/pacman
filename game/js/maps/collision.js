'use strict';

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function resetGhostToAvatarPosition (delta, state, metadata) {
  var playerId = metadata.avatars.target.id;
  var position = state.unwrap(p(playerId, 'pacman.avatar.position'));

  return [
    [p(metadata.avatars.target.id, 'pacman.avatar.ghost'), position],
    [p(metadata.avatars.target.id, 'pacman.avatar.velocity'), {x: 0, y: 0}]
  ];
}

function eatPellet (delta, state, metadata) {
  return [
    'pacman.pellets-', {id: metadata.pellets.target.id}
  ];
}

module.exports = {
  type: 'CollisionMap',
  func: function Pacman () {
    return {
      'avatars': [
        { and: ['walls'], start: [resetGhostToAvatarPosition] },
        { and: ['pellets'], start: [eatPellet]}
      ]
    };
  }
};