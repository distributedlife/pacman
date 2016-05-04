'use strict';

var PIXI = require('pixi.js');
var levelLoader = require('../data/level-loader');
var walls = levelLoader(require('../data/map')).walls;
var each = require('lodash').each;
var filter = require('lodash').filter;
var avatars = {};
var pellets = {};
var $ = require('zepto-browserify').$;

function createBoard (dims) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0x000000);
  shape.drawRect(0, 0, dims.usableWidth, dims.usableHeight);
  shape.zIndex = 10000;

  return shape;
}

function createWall (wall) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0x1d2dac);
  shape.drawRect(wall.position.x, wall.position.y, wall.width, wall.height);
  shape.zIndex = 1000;

  return shape;
}

function createAvatar (avatar) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0xfef854);
  shape.drawRect(0, 0, 10, 10);
  shape.position.x = avatar.position.x - 5;
  shape.position.y = avatar.position.y - 5;
  shape.zIndex = 1;

  return shape;
}

function createPellet (pellet) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0xf1b7ae);
  shape.drawRect(0, 0, 2, 2);
  shape.position.x = pellet.x - 1;
  shape.position.y = pellet.y - 1;
  shape.zIndex = 1;

  return shape;
}

function addAvatar (id, player, stage) {
  avatars[id] = createAvatar(player.pacman.avatar);

  stage.addChild(avatars[id]);
}

function addPellet (id, pellet, stage) {
  pellets[id] = createPellet(pellet);

  stage.addChild(pellets[id]);
}

function removePellet (id, pellet, stage) {
  stage.removeChild(pellets[id]);
}

function moveAvatar (id, player) {
  avatars[id].position.x = player.pacman.avatar.position.x - 5;
  avatars[id].position.y = player.pacman.avatar.position.y - 5;
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

  stage.addChild(createBoard(dims));

  each(walls, function(wall) {
    stage.addChild(createWall(wall));
  });

  tracker().onElementAdded('players', addAvatar, [stage]);
  tracker().onElementAdded('players', addAvatar, [stage]);
  tracker().onElementChanged('players', moveAvatar);
  tracker().onElementAdded('pacman.pellets', addPellet, [stage]);
  tracker().onElementRemoved('pacman.pellets', removePellet, [stage]);
  tracker().onChangeOf(pacmanScore, updateScore);
}

module.exports = display;