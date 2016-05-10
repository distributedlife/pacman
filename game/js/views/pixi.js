var PIXI = require('pixi.js');

const FRONT = 0;

export function sortChildren (stage) {
  stage.children.sort((a, b) =>  (b.zIndex || FRONT) - (a.zIndex || FRONT));
}

export function getTextures(items) {
  return items.map((item) => {
    return PIXI.Texture.fromFrame(item, undefined, PIXI.SCALE_MODES.NEAREST);
  });
}
