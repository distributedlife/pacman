var PIXI = require('pixi.js');

const Front = 0;
const Half = 0.5;
const None = 0;

export function sortChildren (stage) {
  stage.children.sort((a, b) =>  (b.zIndex || Front) - (a.zIndex || Front));
}

export function getTextures(items) {
  return items.map((item) => {
    return PIXI.Texture.fromFrame(item, undefined, PIXI.SCALE_MODES.NEAREST);
  });
}

function isASmallerThanB(board, usable) {
  return (board.width < usable.width || board.height < usable.height);
}

function calculateOffset (board, usable) {
  if (isASmallerThanB(board, usable)) {
    const margin = {
      x: usable.width - board.width,
      y: usable.height - board.height
    };

    return {
      x: margin.x < None ? None : margin.x * Half,
      y: margin.y < None ? None : margin.y * Half
    };
  }

  return {x: 0, y: 0 };
}

export function calculateScale (board, usable) {
  const ratio = Math.min(
    usable.width / board.width, usable.height / board.height
  );

  return { x: ratio, y: ratio };
}

export function resizeRenderer (renderer, usable) {
  if (!renderer) {
    return;
  }

  renderer.resize(usable.width, usable.height);
}

export function resizeStage (stage, board, usable) {
  if (!stage) {
    return;
  }

  const scale = calculateScale(board, usable);
  stage.scale.x = scale.x;
  stage.scale.y = scale.y;

  const scaledBoard = {
    width: board.width * scale.x,
    height: board.height * scale.y
  };

  const offset = calculateOffset(scaledBoard, usable);
  stage.position.x = offset.x;
  stage.position.y = offset.y;
}