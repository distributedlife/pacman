'use strict';

import {createBoard, createAvatar, createPellet, createEnergiser, createWall, sequences} from './pixi-pacman.js';

import {sortChildren, getTextures} from './pixi.js';

const INITIAL_SCORE = 0;
const positionPacmanCorrectlyOffset = 8;

var Howl = require('howler').Howl;
var levelLoader = require('../data/level-loader');
var walls = levelLoader(require('../data/map')).walls;
var each = require('lodash').each;
var filter = require('lodash').filter;
var avatars = {};
var pellets = {};
var energisers = {};
var $ = require('jquery-browserify');

// var death = new Howl({ src: ['/game/assets/audio/pacman_death.wav'] });
// var eatGhost = new Howl({ src: ['/game/assets/audio/pacman_eatghost.wav'] });
var ghostNear = new Howl({ src: ['/game/assets/audio/ghost-near.mp3'] });

function addAvatar (id, player, stage) {
  avatars[id] = createAvatar(player.pacman);

  stage.addChild(avatars[id].avatar);

  sortChildren(stage);
}

function addPellet (id, pellet, stage) {
  pellets[id] = createPellet(pellet);

  stage.addChild(pellets[id]);
}

function removePellet (id, pellet, stage) {
  stage.removeChild(pellets[id]);
}

function addEnergiser (id, energiser, stage) {
  energisers[id] = createEnergiser(energiser);

  stage.addChild(energisers[id]);
}

function removeEnergiser (id, energiser, stage) {
  stage.removeChild(energisers[id]);
}

function moveAvatar (id, current, prior, stage) {
  if ((current && current.role) !== (prior && prior.role)) {
    stage.removeChild(avatars[id]);

    addAvatar(id, current, stage);
  }

  let direction = current.pacman.direction;

  avatars[id].avatar.position.x = current.pacman.position.x -positionPacmanCorrectlyOffset;
  avatars[id].avatar.position.y = current.pacman.position.y -positionPacmanCorrectlyOffset;

  if (prior) {
    avatars[id].animations[prior.pacman.direction].visible = false;
  }
  avatars[id].animations[direction].visible = true;

  if (current.pacman.moving) {
    avatars[id].animations[direction].play();
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

  return (pacman === undefined) ? INITIAL_SCORE : pacman.pacman.score;
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
  tracker().onElementChanged('players', moveAvatar, [stage]);
  tracker().onElementAdded('pacman.pellets', addPellet, [stage]);
  tracker().onElementRemoved('pacman.pellets', removePellet, [stage]);
  tracker().onElementAdded('pacman.energisers', addEnergiser, [stage]);
  tracker().onElementRemoved('pacman.energisers', removeEnergiser, [stage]);
  tracker().onChangeOf(pacmanScore, updateScore);
  tracker().onChangeTo('pacman.ghostNear', true, function () {
    ghostNear.play();
  });
}

module.exports = display;