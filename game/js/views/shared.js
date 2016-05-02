'use strict';

var PIXI = require('pixi.js');
var levelLoader = require('../data/level-loader');
var walls = levelLoader(require('../data/map')).walls;
var each = require('lodash').each;
var avatars = {};

function createBoard (dims) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0x000000);
  shape.drawRect(0, 0, dims.usableWidth, dims.usableHeight);
  shape.zIndex = 10000;

  return shape;
}

function createWall (wall) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0x0000FF);
  shape.drawRect(wall.position.x, wall.position.y, wall.width, wall.height);
  shape.zIndex = 1000;

  return shape;
}

function createAvatar (avatar) {
  var shape = new PIXI.Graphics();
  shape.beginFill(0x888800);
  shape.drawRect(0, 0, 10, 10);
  shape.position.x = avatar.position.x - 5;
  shape.position.y = avatar.position.y - 5;
  shape.zIndex = 1;

  console.log(avatar.position);

  return shape;
}

function addAvatar (id, player, stage) {
  avatars[id] = createAvatar(player.pacman.avatar);

  stage.addChild(avatars[id]);
}

function moveAvatar (id, player) {
  avatars[id].position.x = player.pacman.avatar.position.x - 5;
  avatars[id].position.y = player.pacman.avatar.position.y - 5;
}

function display (dims, stage, tracker) {
  stage.addChild(createBoard(dims));

  each(walls, function(wall) {
    stage.addChild(createWall(wall));
  });

  tracker().onElementAdded('players', addAvatar, [stage]);
  tracker().onElementChanged('players', moveAvatar);
}

module.exports = display;