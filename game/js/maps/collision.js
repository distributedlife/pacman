'use strict';

function p(id, path) {
  return 'players:' + id + '.' + path;
}

function stop (delta, state, metadata) {
  console.log(metadata);
  return [
    p(metadata.avatars.target.id, 'pacman.avatar.velocity'), {x: 0, y: 0}
  ];
}

module.exports = {
  type: 'CollisionMap',
  func: function Pacman () {
    return {
      'avatars': [
        { and: ['walls'], start: [stop] }
      ]
    };
  }
};