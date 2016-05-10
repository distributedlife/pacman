'use strict';

var PIXI = require('pixi.js');

import {sortChildren} from './pixi';

function boardIsSmallerThenScreen(boardDimensions, screenDimensions) {
  return (boardDimensions.width < screenDimensions.usableWidth ||
      boardDimensions.height < screenDimensions.usableHeight);
}

function boardIsLargerThanScreen(boardDimensions, screenDimensions) {
  return !boardIsSmallerThenScreen(boardDimensions, screenDimensions);
}

function calculateOffset (boardDimensions, screenDimensions) {
  if (boardIsSmallerThenScreen(boardDimensions, screenDimensions)) {
    return {
      x: (screenDimensions.usableWidth - boardDimensions.width) / 2,
      y: (screenDimensions.usableHeight - boardDimensions.height) / 2
    };
  }

  return { x: 0, y: 0 };
}

function scaleBoard (dims, config) {
  if (boardIsLargerThanScreen(config.pacman.board, dims)) {
    let ratio = Math.min(
      dims.screenWidth/config.pacman.board.width,
      dims.screenHeight/config.pacman.board.height
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

// var define = require('ensemblejs/define');
// var state = require('ensemblejs/state');;

//jshint maxparams:false
module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTracker', 'DefinePlugin', '$', 'DeviceMode'],
  func: function View (config, tracker, define, $, deviceMode) {

    var scalingFactor = 1;
    var setupScreenAsSharedScreen = require('./shared');
    var setupScreenAsPacman = require('./pacman');
    var setupScreenAsBlinky = require('./blinky');
    var setupScreenAsPinky = require('./pinky');
    var setupScreenAsInky = require('./inky');
    var setupScreenAsClyde = require('./clyde');
    var setupScreenAsWaitingRoom = require('./waiting-room');

    var stage;
    var offset;
    var scale;
    return function setup (dims, playerNumber) {
      scalingFactor = dims.usableWidth / 280;

      let renderer;

      PIXI.loader
        .add('/game/assets/images/pacman.json')
        .add('/game/assets/images/ghost.json')
        .load(function () {
          stage = new PIXI.Container();
          renderer = PIXI.autoDetectRenderer(dims.usableWidth, dims.usableHeight);
          $()('#' + config().client.element).append(renderer.view);

          offset = calculateOffset(config().pacman.board, dims);
          stage.position.x = offset.x;
          stage.position.y = offset.y;
          scale = scaleBoard(dims, config());
          stage.scale.x = scale.x;
          stage.scale.y = scale.y;

          // if (deviceMode() === 'observer') {
            setupScreenAsSharedScreen(dims, stage, tracker);
          // }

          tracker().onChangeTo('players:' + playerNumber + '.pacman.role', 'pacman', setupScreenAsPacman, [stage, tracker]);
          // tracker().onChangeTo('players:' + playerNumber + '.pacman.role', 'blinky', setupScreenAsBlinky, [stage]);
          // tracker().onChangeTo('players:' + playerNumber + '.pacman.role', 'pinky', setupScreenAsPinky, [stage]);
          // tracker().onChangeTo('players:' + playerNumber + '.pacman.role', 'inky', setupScreenAsInky, [stage]);
          // tracker().onChangeTo('players:' + playerNumber + '.pacman.role', 'clyde', setupScreenAsClyde, [stage]);
          // tracker().onChangeTo('players:' + playerNumber + '.pacman.role', 'waiting', setupScreenAsWaitingRoom, [stage]);

          sortChildren(stage);
        });

      define()('OnRenderFrame', function OnRenderFrame () {
        return function renderScene () {
          if (!renderer) {
            return;
          }

          renderer.render(stage);
        };
      });
    };
  }
};