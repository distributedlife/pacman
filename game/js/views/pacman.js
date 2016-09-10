'use strict';

var Howl = require('howler').Howl;
var chomp = new Howl({
  src: ['/game/assets/audio/eat-pellet.mp3', '/game/assets/audio/eat-pellet.wav'],
  buffer: true
});
// var vibrate = require('vibrate');

function removePellet (id) {
  console.log(`Removed pellet from display ${id}`);
  chomp.play();
  // vibrate(50);
}

function display (current, prior, stage, tracker) {
  tracker().onElementRemoved('pacman.pellets', removePellet);
}

module.exports = display;