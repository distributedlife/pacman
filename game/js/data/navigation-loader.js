'use strict';

var map = require('lodash').map;
var filter = require('lodash').filter;
var first = require('lodash').first;
var loader = require('./level-loader');

var leftOf = require('./node-traversal').leftOf;
var rightOf = require('./node-traversal').rightOf;
var above = require('./node-traversal').above;
var below = require('./node-traversal').below;

function navigationLoader (fileContents) {
  var nodes = loader(fileContents).node;
  var tunnels = loader(fileContents).tunnel;

  function pairOf (node) {
    if (!node) {
      return undefined;
    }

    return first(filter(tunnels, function (tunnel) {
      return (tunnel.id !== node.id) && (tunnel.raw === node.raw);
    }));
  }

  return map(nodes, function (node) {
    var up = first(filter(nodes, above(node)));
    var down = first(filter(nodes, below(node)));
    var left = first(filter(nodes, leftOf(node)));
    var right = first(filter(nodes, rightOf(node)));

    var tLeft = first(filter(tunnels, leftOf(node)));
    var tRight = first(filter(tunnels, rightOf(node)));
    var tUp = first(filter(tunnels, above(node)));
    var tDown = first(filter(tunnels, below(node)));

    left = tLeft ? first(filter(nodes, leftOf(pairOf(tLeft)))) : left;
    right = tRight ? first(filter(nodes, rightOf(pairOf(tRight)))) : right;
    up = tUp ? first(filter(nodes, above(pairOf(tUp)))) : up;
    down = tDown ? first(filter(nodes, below(pairOf(tDown)))) : down;

    return {
      id: node.id,
      type: node.type,
      raw: node.raw,
      x: node.x,
      y: node.y,
      left: left && left.id,
      right: right && right.id,
      up: up && up.id,
      down: down && down.id
    };
  });
}

module.exports = navigationLoader;