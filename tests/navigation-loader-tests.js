'use strict';

var loader = require('../game/js/data/navigation-loader');
var filter = require('lodash').filter;
var expect = require('expect');

describe('navigation loader', function () {
  var legend = {
    '.': { type: 'node', parser: 'point-with-id'},
    'A': { type: 'tunnel', parser: 'point-with-id'},
    'B': { type: 'tunnel', parser: 'point-with-id'}
  };

  describe('a node with a neighbour', function () {
    var level = [
      'X.X',
      '...',
      'X.X'
    ];

    it('should create two linked nodes', function () {
      var nodes = loader({maze: level, legend: legend, gridSize: 1});

      expect(filter(nodes, {x: 1, y: 0})[0].left).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 0})[0].up).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 0})[0].right).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 0})[0].down).toBe(3);

      expect(filter(nodes, {x: 0, y: 1})[0].left).toBe(undefined);
      expect(filter(nodes, {x: 0, y: 1})[0].up).toBe(undefined);
      expect(filter(nodes, {x: 0, y: 1})[0].right).toBe(3);
      expect(filter(nodes, {x: 0, y: 1})[0].down).toBe(undefined);

      expect(filter(nodes, {x: 1, y: 1})[0].left).toBe(2);
      expect(filter(nodes, {x: 1, y: 1})[0].up).toBe(1);
      expect(filter(nodes, {x: 1, y: 1})[0].right).toBe(4);
      expect(filter(nodes, {x: 1, y: 1})[0].down).toBe(5);

      expect(filter(nodes, {x: 2, y: 1})[0].left).toBe(3);
      expect(filter(nodes, {x: 2, y: 1})[0].up).toBe(undefined);
      expect(filter(nodes, {x: 2, y: 1})[0].right).toBe(undefined);
      expect(filter(nodes, {x: 2, y: 1})[0].down).toBe(undefined);

      expect(filter(nodes, {x: 1, y: 2})[0].left).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 2})[0].up).toBe(3);
      expect(filter(nodes, {x: 1, y: 2})[0].right).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 2})[0].down).toBe(undefined);
    });
  });

  describe('the magic tunnel', function () {
    var level = [
      ' B  ',
      'A..A',
      ' .  ',
      ' B  '
    ];

    it('should link the tunnel together', function () {
      var nodes = loader({maze: level, legend: legend, gridSize: 1});

      expect(filter(nodes, {x: 1, y: 1})[0].left).toBe(14);
      expect(filter(nodes, {x: 1, y: 1})[0].right).toBe(14);
      expect(filter(nodes, {x: 1, y: 1})[0].up).toBe(16);
      expect(filter(nodes, {x: 1, y: 1})[0].down).toBe(16);

      expect(filter(nodes, {x: 2, y: 1})[0].left).toBe(13);
      expect(filter(nodes, {x: 2, y: 1})[0].right).toBe(13);

      expect(filter(nodes, {x: 1, y: 2})[0].left).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 2})[0].right).toBe(undefined);
      expect(filter(nodes, {x: 1, y: 2})[0].up).toBe(13);
      expect(filter(nodes, {x: 1, y: 2})[0].down).toBe(13);
    });
  });
});