'use strict';

var each = require('lodash').each;
var sequence = require('distributedlife-sequence');

function parseCell (colIndex, rowIndex, gridSize) {
  return {
    position: {'x': colIndex * gridSize, 'y': rowIndex * gridSize},
    width: gridSize - 1,
    height: gridSize - 1
  };
}

function parseCellWithId (colIndex, rowIndex, gridSize) {
  return {
    id: sequence.next('map-thing'),
    position: {'x': colIndex * gridSize, 'y': rowIndex * gridSize},
    width: gridSize - 1,
    height: gridSize - 1
  };
}

function parsePointWithId (colIndex, rowIndex, gridSize) {
  return {
    id: sequence.next('map-thing'),
    x: (colIndex * gridSize),
    y: (rowIndex * gridSize)
  };
}


function parsePoint (colIndex, rowIndex, gridSize) {
  return {
    x: (colIndex * gridSize),
    y: (rowIndex * gridSize)
  };
}

var parsers = {
  'point-with-id': parsePointWithId,
  'cell-with-id': parseCellWithId,
  'cell': parseCell,
  'point': parsePoint
};

var walls = [
  'cell-top-left',
  'cell-top-right',
  'cell-bottom-left',
  'cell-bottom-right',
  'cell-gate-left',
  'cell-gate-right',
  'double-top-left',
  'double-top-right',
  'double-top',
  'double-bottom-left',
  'double-bottom-right',
  'double-bottom',
  'double-left',
  'double-right',
  'single-top-left',
  'single-top-right',
  'single-top',
  'single-bottom-left',
  'single-bottom-right',
  'single-bottom',
  'single-left',
  'single-right',
  'split-top-left-horizontal',
  'split-top-left-vertical',
  'split-top-right-horizontal',
  'split-top-right-vertical',
  'split-bottom-left',
  'split-bottom-right'
];

function levelLoader (fileContents) {
  var level = {};

  each(fileContents.legend, function (entry) {
    level[entry.type] = [];
  });

  each(fileContents.maze, function (row, rowIndex) {
    each(row.split(''), function (cell, colIndex) {
      if (fileContents.legend[cell] === undefined) {
        return;
      }

      var type = fileContents.legend[cell].type;
      var parser = fileContents.legend[cell].parser;

      var parsed = parsers[parser](colIndex, rowIndex, fileContents.gridSize);
      parsed.type = type;
      parsed.raw = cell;

      level[type].push(parsed);
    });
  });

  level.walls = [];
  each(walls, function (wall) {
    level.walls = level.walls.concat(level[wall]);
  });

  return level;
}

module.exports = levelLoader;