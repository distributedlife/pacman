'use strict';

function leftOf (pos) {   return {x: pos.x - 1, y: pos.y}; }
function rightOf (pos) {  return {x: pos.x + 1, y: pos.y}; }
function above (pos) {    return {x: pos.x,     y: pos.y - 1}; }
function below (pos) {    return {x: pos.x,     y: pos.y + 1}; }

module.exports = {
  leftOf: leftOf,
  rightOf: rightOf,
  above: above,
  below: below
};