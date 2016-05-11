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

function boardIsSmallerThenScreen(board, usable) {
  return (board.width < usable.width || board.height < usable.height);
}

function boardIsLargerThanScreen(board, usable) {
  return !boardIsSmallerThenScreen(board, usable);
}

export function calculateOffset (board, usable) {
  if (boardIsSmallerThenScreen(board, usable)) {
    return {
      x: (usable.width - board.width) / 4,
      y: (usable.height - board.height) / 4
    };
  }

  return { x: 0, y: 0 };
}

export function calculateScale (board, screen, usable) {
  if (boardIsLargerThanScreen(board, usable)) {
    // TODO: can we use ratio from somewhere else?
    let ratio = Math.min(
      screen.width/board.width,
      screen.height/board.height
    );

    return {
      x: ratio,
      y: ratio
    };
  }

  return {
    x: 1.0,
    y: 1.0
  };
}

export function resizeRenderer (renderer, usable) {
  if (!renderer) {
    return;
  }

  renderer.resize(usable.width, usable.height);
}

export function resizeStage (stage, board, screen, usable) {
  if (!stage) {
    return;
  }

  const scale = calculateScale(board, screen, usable);
  stage.scale.x = scale.x;
  stage.scale.y = scale.y;

  const offset = calculateOffset(board, usable);
  stage.position.x = offset.x;
  stage.position.y = offset.y;
}