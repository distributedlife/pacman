'use strict';

// var Howl = require('howler').Howl;
var PIXI = require('pixi.js');
var levelLoader = require('../data/level-loader');
var walls = levelLoader(require('../data/map')).walls;
var each = require('lodash').each;
var map = require('lodash').map;
var filter = require('lodash').filter;
var avatars = {};
var pellets = {};
var energisers = {};
var $ = require('zepto-browserify').$;

// var death = new Howl({
//   src: ['/game/assets/audio/pacman_death.wav']
// });
var movePlaying = false;
// var move = new Howl({
//   src: ['/game/assets/audio/pacman_move2.mp3'],
//   loop: true,
//   onend: function () {
//     movePlaying = false;
//   }
// });
var chompPlaying = false;
// var chomp = new Howl({
//   src: ['/game/assets/audio/pacman_chomp.wav'],
//   sprite: { chomp: [0, 180] },
//   onend: function () {
//     chompPlaying = false;
//   }
// });
// var eatGhost = new Howl({
//   src: ['/game/assets/audio/pacman_eatghost.wav']
// });

var gridSize = 1;

function createBoard (dims) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0x000000);
  shape.drawRect(0, 0, dims.usableWidth, dims.usableHeight);
  shape.zIndex = 10000;

  return shape;
}

function mazeImage (type) {
  return '/game/assets/images/maze/' + type + '.png';
}

function image (type) {
  return '/game/assets/images/' + type + '.png';
}

function createWall (wall) {
  var sprite = new PIXI.Sprite.fromImage(mazeImage(wall.type), undefined, PIXI.SCALE_MODES.NEAREST);
  sprite.position.x = wall.position.x * gridSize;
  sprite.position.y = wall.position.y * gridSize;
  sprite.scale = {x: 2.0, y: 2.0};
  sprite.zIndex = 1000;

  return sprite;
}

function getTextures(items) {
  return map(items, function (item) {
    return PIXI.Texture.fromFrame(item, undefined, PIXI.SCALE_MODES.NEAREST);
  });
}

var sequences = {
  pacman: {},
  blinky: {},
  pinky: {},
  inky: {},
  clyde: {}
};

var scale = {
  pacman: {x: 2, y: 2},
  blinky: {x: 1.0, y: 1.0},
  pinky: {x: 1.0, y: 1.0},
  inky: {x: 1.0, y: 1.0},
  clyde: {x: 1.0, y: 1.0}
};

function createAvatar (player) {
  var role = player.role;

  var avatar = new PIXI.Container();
  var animations = {};

  Object.keys(sequences[role]).forEach(function(key) {
    var animation = new PIXI.extras.MovieClip(sequences[role][key]);
    animation.animationSpeed = 0.15;
    animation.play();
    animation.visible = false;

    avatar.addChild(animation);
    animations[key] = animation;
  });

  animations.left.visible = true;
  avatar.position.x = player.position.x * gridSize;
  avatar.position.y = player.position.y * gridSize;
  avatar.scale = scale[role];
  avatar.zIndex = 1;

  return { animations: animations, avatar: avatar };
}

function createPellet (pellet) {
  var sprite = new PIXI.Sprite.fromImage(image('pellet'), undefined, PIXI.SCALE_MODES.NEAREST);
  sprite.position.x = pellet.position.x * gridSize;
  sprite.position.y = pellet.position.y * gridSize;
  sprite.scale = {x: 2.0, y: 2.0};
  sprite.zIndex = 10;

  return sprite;
}

function createEnergiser (energiser) {
  var sprite = new PIXI.Sprite.fromImage(image('energiser'), undefined, PIXI.SCALE_MODES.NEAREST);
  sprite.position.x = energiser.position.x * gridSize;
  sprite.position.y = energiser.position.y * gridSize;
  sprite.scale = {x: 2.0, y: 2.0};
  sprite.zIndex = 10;

  return sprite;
}

function addAvatar (id, player, stage) {
  avatars[id] = createAvatar(player.pacman);

  stage.addChild(avatars[id].avatar);
}

function addPellet (id, pellet, stage) {
  pellets[id] = createPellet(pellet);

  stage.addChild(pellets[id]);
}

function removePellet (id, pellet, stage) {
  stage.removeChild(pellets[id]);
  if (!chompPlaying) {
    chompPlaying = true;
    // chomp.play('chomp');
  }
}

function addEnergiser (id, energiser, stage) {
  energisers[id] = createEnergiser(energiser);

  stage.addChild(energisers[id]);
}

function removeEnergiser (id, energiser, stage) {
  stage.removeChild(energisers[id]);
  if (!chompPlaying) {
    chompPlaying = true;
    // chomp.play('chomp');
  }
}

function moveAvatar (id, current, prior) {
  var direction = current.pacman.direction;

  avatars[id].avatar.position.x = current.pacman.position.x * gridSize;
  avatars[id].avatar.position.y = current.pacman.position.y * gridSize;

  avatars[id].animations[prior.pacman.direction].visible = false;
  avatars[id].animations[direction].visible = true;

  if (current.pacman.moving) {
    avatars[id].animations[direction].play();

    if (current.pacman.role === 'pacman' && movePlaying === false) {
      movePlaying = true;
      // move.play();
    }
  } else {
    avatars[id].animations[direction].stop();
  }
}

function updateScore (current) {
  $('#score').text(current);
}

//Lens
function pacmanScore (state) {
  var pacman = filter(state.players, { pacman: { role: 'pacman' }})[0];

  return (pacman === undefined) ? 0 : pacman.pacman.score;
}

function display (dims, stage, tracker) {
  var overlay = require('../../views/overlays/pacman.pug');
  $('#overlay').append(overlay());

  sequences.pacman.right = getTextures(['pacman-right-1', 'pacman-right-2']);
  sequences.pacman.left = getTextures(['pacman-left-1', 'pacman-left-2']);
  sequences.pacman.up = getTextures(['pacman-up-1', 'pacman-up-2']);
  sequences.pacman.down = getTextures(['pacman-down-1', 'pacman-down-2']);
  sequences.pacman.full = getTextures(['pacman-full-1', 'pacman-full-2']);
  sequences.pacman.death = getTextures(['pacman-death-1', 'pacman-death-2', 'pacman-death-3', 'pacman-death-4', 'pacman-death-5', 'pacman-death-6', 'pacman-death-7', 'pacman-death-8', 'pacman-death-9', 'pacman-death-10', 'pacman-death-11', 'pacman-death-12']);

  sequences.blinky.right = getTextures(['blinky-right-1', 'blinky-right-2']);
  sequences.blinky.left = getTextures(['blinky-left-1', 'blinky-left-2']);
  sequences.blinky.up = getTextures(['blinky-up-1', 'blinky-up-2']);
  sequences.blinky.down = getTextures(['blinky-down-1', 'blinky-down-2']);

  sequences.pinky.right = getTextures(['pinky-right-1', 'pinky-right-2']);
  sequences.pinky.left = getTextures(['pinky-left-1', 'pinky-left-2']);
  sequences.pinky.up = getTextures(['pinky-up-1', 'pinky-up-2']);
  sequences.pinky.down = getTextures(['pinky-down-1', 'pinky-down-2']);

  sequences.inky.right = getTextures(['inky-right-1', 'inky-right-2']);
  sequences.inky.left = getTextures(['inky-left-1', 'inky-left-2']);
  sequences.inky.up = getTextures(['inky-up-1', 'inky-up-2']);
  sequences.inky.down = getTextures(['inky-down-1', 'inky-down-2']);

  sequences.clyde.right = getTextures(['clyde-right-1', 'clyde-right-2']);
  sequences.clyde.left = getTextures(['clyde-left-1', 'clyde-left-2']);
  sequences.clyde.up = getTextures(['clyde-up-1', 'clyde-up-2']);
  sequences.clyde.down = getTextures(['clyde-down-1', 'clyde-down-2']);

  stage.addChild(createBoard(dims));

  each(walls, function(wall) {
    stage.addChild(createWall(wall));
  });

  tracker().onElementAdded('players', addAvatar, [stage]);
  tracker().onElementChanged('players', moveAvatar);
  tracker().onElementAdded('pacman.pellets', addPellet, [stage]);
  tracker().onElementRemoved('pacman.pellets', removePellet, [stage]);
  tracker().onElementAdded('pacman.energisers', addEnergiser, [stage]);
  tracker().onElementRemoved('pacman.energisers', removeEnergiser, [stage]);
  tracker().onChangeOf(pacmanScore, updateScore);
}

module.exports = display;