'use strict';

var each = require('lodash').each;

var gridSize = 10;

function parseCell (colIndex, rowIndex) {
  return {
    'position': {'x': colIndex * gridSize, 'y': rowIndex * gridSize},
    'width': gridSize,
    'height': gridSize
  };
}

function parsePoint (colIndex, rowIndex) {
  return {
    x: (colIndex * gridSize) - (gridSize / 2),
    y: (rowIndex * gridSize) - (gridSize / 2)
  };
}

var parsers = {
  '.': parseCell,
  '=': parseCell,
  '*': parseCell,
  'X': parsePoint,
  'P': parsePoint,
  'Y': parsePoint,
  'R': parsePoint,
  'B': parsePoint,
  '┌': parseCell,
  '─': parseCell,
  '┐': parseCell,
  '│': parseCell,
  '└': parseCell,
  '┘': parseCell,
};

var legend = {
  '.': 'pellets',
  '*': 'powerup',
  'X': 'spawn',
  '┌': 'walls',
  '─': 'walls',
  '┐': 'walls',
  '│': 'walls',
  '└': 'walls',
  '┘': 'walls'
};

function levelLoader (fileContents) {
  var level = {
    walls: [],
    spawn: [],
    pellets: [],
    powerup: []
  };

  each(fileContents, function (row, rowIndex) {
    each(row.split(''), function (cell, colIndex) {
      if (legend[cell] === undefined) {
        return;
      }

      level[legend[cell]].push(parsers[cell](colIndex, rowIndex));
    });
  });

  return level;
}

module.exports = levelLoader;