var PIXI = require('pixi.js');

const FRONT = 0;
const HALF = 0.5;

export function sortChildren (stage) {
  stage.children.sort((a, b) =>  (b.zIndex || FRONT) - (a.zIndex || FRONT));
}

export function getTextures(items) {
  return items.map((item) => {
    return PIXI.Texture.fromFrame(item, undefined, PIXI.SCALE_MODES.NEAREST);
  });
}

function isASmallerThanB(board, usable) {
  return (board.width < usable.width || board.height < usable.height);
}

function isALargerThanB(board, usable) {
  return board.width >= usable.width && board.height >= usable.height;
}

export function calculateOffset (board, usable) {
  if (isASmallerThanB(board, usable)) {
    return {
      x: (usable.width - board.width) * HALF,
      y: (usable.height - board.height) * HALF
    };
  }

  return { x: 0, y: 0 };
}

export function calculateScale (board, screen, usable) {
  let min = Math.min(screen.width/board.width, screen.height/board.height);

  let imin = Math.min(board.width/screen.width, board.height/screen.height);

  console.log('board', board);
  console.log('usable', usable);
  console.log('screen', screen);
  console.log(min, imin);

  let ratio;
  // if (usable.height > usable.width) {
  //   ratio = Math.min(screen.width/board.width, screen.height/board.height);
  // } else {
  //   ratio = Math.max(screen.width/board.width, screen.height/board.height);
  // }

  ratio = Math.min(screen.width/board.width, screen.height/board.height);


  if (isALargerThanB(board, usable)) {
    console.log('larger');
    return {
      x: ratio,
      y: ratio
    };
  }

  console.log('smaller');
  return { x: 1.0, y: 1.0 };
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