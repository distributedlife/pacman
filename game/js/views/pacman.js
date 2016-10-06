'use strict';

const Howl = require('howler').Howl;
const chomp = new Howl({
  src: ['/game/assets/audio/eat-pellet.mp3', '/game/assets/audio/eat-pellet.wav'],
  buffer: true
});
const vibrate = require('vibrate');

function removePellet () {
  chomp.play();
  vibrate(50);
}

function display (current, prior, stage, tracker) {
  tracker().onElementRemoved('pacman.pellets', removePellet);
}

module.exports = display;