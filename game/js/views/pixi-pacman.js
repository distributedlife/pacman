var PIXI = require('pixi.js');

const black = 0x000000;
const topLeft = {x: 0, y: 0};
const positionPacmanCorrectlyOffset = 8;

function mazeImage (type) {
  return `/game/assets/images/maze/${type}.png`;
}

function image (type) {
  return `/game/assets/images/${type}.png`;
}

export function createBoard (dims) {
  var shape = new PIXI.Graphics();
  shape.beginFill(black);
  shape.drawRect(topLeft.x, topLeft.y, dims.usableWidth, dims.usableHeight);
  shape.zIndex = 10000;

  return shape;
}

export function createWall (wall) {
  var sprite = new PIXI.Sprite.fromImage(mazeImage(wall.type), undefined, PIXI.SCALE_MODES.NEAREST);
  sprite.position.x = wall.position.x;
  sprite.position.y = wall.position.y;
  sprite.scale = {x: 2.0, y: 2.0};
  sprite.zIndex = 1000;

  return sprite;
}

export const sequences = {
  pacman: {},
  blinky: {},
  pinky: {},
  inky: {},
  clyde: {}
};

const scale = {
  pacman: {x: 2, y: 2},
  blinky: {x: 1.0, y: 1.0},
  pinky: {x: 1.0, y: 1.0},
  inky: {x: 1.0, y: 1.0},
  clyde: {x: 1.0, y: 1.0}
};

export function createAvatar (player) {
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
  avatar.position.x = player.position.x - positionPacmanCorrectlyOffset;
  avatar.position.y = player.position.y - positionPacmanCorrectlyOffset;
  avatar.scale = scale[role];
  avatar.zIndex = 1;

  return { animations: animations, avatar: avatar };
}

export function createPellet (pellet) {
  var sprite = new PIXI.Sprite.fromImage(image('pellet'), undefined, PIXI.SCALE_MODES.NEAREST);
  sprite.position.x = pellet.position.x;
  sprite.position.y = pellet.position.y;
  sprite.scale = {x: 2.0, y: 2.0};
  sprite.zIndex = 10;

  return sprite;
}

export function createEnergiser (energiser) {
  var sprite = new PIXI.Sprite.fromImage(image('energiser'), undefined, PIXI.SCALE_MODES.NEAREST);
  sprite.position.x = energiser.position.x;
  sprite.position.y = energiser.position.y;
  sprite.scale = {x: 2.0, y: 2.0};
  sprite.zIndex = 10;

  return sprite;
}