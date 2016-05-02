'use strict';

var PIXI = require('pixi.js');
var levelLoader = require('../data/level-loader');
var walls = levelLoader(require('../data/map')).walls;
var each = require('lodash').each;

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
  } else {
    return { x: 0, y: 0 };
  }
}

function scaleBoard (dims, config) {
  if (boardIsLargerThanScreen(config.pacman.board, dims)) {
    var ratio = Math.min(
      dims.screenWidth/config.pacman.board.width,
      dims.screenHeight/config.pacman.board.height
    );

    return {
      x: ratio,
      y: ratio
    };
  } else {
    return {
      x: 1.0,
      y: 1.0
    };
  }
}

//jshint maxparams:false
module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTracker', 'DefinePlugin', '$'],
  func: function View (config, tracker, define, $) {

    var scalingFactor = 1;

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
      shape.position.x = avatar.position.x;
      shape.position.y = avatar.position.y;
      shape.zIndex = 1;

      console.log(avatar.position);

      return shape;
    }


    var avatars = {};
    function addAvatar (id, player, stage) {
      avatars[id] = createAvatar(player.pacman.avatar);

      stage.addChild(avatars[id]);
    }

    function moveAvatar (id, player) {
      avatars[id].position.x = player.pacman.avatar.position.x;
      avatars[id].position.y = player.pacman.avatar.position.y;
    }

    var stage;
    var offset;
    var scale;
    return function setup (dims) {
      scalingFactor = dims.usableWidth / 280;

      stage = new PIXI.Container();
      var renderer = PIXI.autoDetectRenderer(dims.usableWidth, dims.usableHeight);
      $()('#' + config().client.element).append(renderer.view);

      offset = calculateOffset(config().pacman.board, dims);
      stage.position.x = offset.x;
      stage.position.y = offset.y;
      scale = scaleBoard(dims, config());
      stage.scale.x = scale.x;
      stage.scale.y = scale.y;

      stage.addChild(createBoard(dims));

      each(walls, function(wall) {
        stage.addChild(createWall(wall));
      });

      tracker().onElementAdded('players', addAvatar, [stage]);
      tracker().onElementChanged('players', moveAvatar);

      define()('OnRenderFrame', function OnRenderFrame () {
        return function renderScene () {
          renderer.render(stage);
        };
      });
    };
  }
};