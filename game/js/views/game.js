'use strict';

import PIXI from 'pixi.js';
import {sortChildren, resizeStage, resizeRenderer} from './pixi';
import {on} from 'ensemblejs/lib/events';

// var state = require('ensemblejs/state');;

module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTracker', 'Window'],
  func: function View (config, tracker, window) {

    let setupScreenAsSharedScreen = require('./shared');
    let setupScreenAsPacman = require('./pacman');
    // let setupScreenAsBlinky = require('./blinky');
    // let setupScreenAsPinky = require('./pinky');
    // let setupScreenAsInky = require('./inky');
    // let setupScreenAsClyde = require('./clyde');
    // let setupScreenAsWaitingRoom = require('./waiting-room');
    let stage;
    let renderer;

    on('RenderFrame', function OnRenderFrame () {
      return function renderScene () {
        if (!renderer) {
          return;
        }

        renderer.render(stage);
      };
    });

    function resize (dims) {
      const board = {
        width: 448,
        height: 496
      };
      const usable = {
        width: dims.usableWidth,
        height: dims.usableHeight
      };

      resizeRenderer(renderer, usable);
      resizeStage(stage, board, usable);
    }

    on('Resize', function OnResize () { return resize; });
    // on('Resize', ['Dep'], dep => resize(dep)]);
    // on('Resize', resize); is on('Resize', [], () => resize()]);

    return function setup (dims, playerNumber) {
      PIXI.loader
        .add('/game/assets/images/pacman.json')
        .add('/game/assets/images/ghost.json')
        .load(function () {
          stage = new PIXI.Container();
          renderer = PIXI.autoDetectRenderer(dims.usableWidth, dims.usableHeight);

          const parent = window().document.querySelector(`#${config().client.element}`);
          parent.appendChild(renderer.view);

          resize(dims);

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
    };
  }
};