"use strict";

/**
 * Tests whether something is between (INCLUSIVE) two limits.
 * Use Infinity/-Infinity for unbounded limits.
 * @param {Number} x 
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Boolean}
 */
const between = function(x, min, max) {
  if ((x >= min) & (x <= max)) {
    return true
  }
  return false
}

const board = (() => {
  // needs to tell you what is needed to draw it
  const xMin = 0;
  const xMax = 2;
  const yMin = 0;
  const yMax = 2;
  
  const spaces = {};
  // spaces["1,1"] = "x";

  // questionable value
  const withinBorders = function(x, y){
    if ((between(x, xMin, xMax)) & between(y, yMin, yMax)) {
      return true;
    }
    return false;
  }

  const key = function(x, y){
    return `${x},${y}`;
  }

  const clearBoard = function() {
    console.log("Board-clear not implemented")
  }

  // Thinking about infinite boards is bogging me down, so
  // I'll start with creating a 3x3 flat board
  const newBoard = function() {
    clearBoard()
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        spaces[key(x, y)] = null;
      }
    }
  }

  const setMove = function(x, y, value) {
    if ((key(x, y)) in spaces) {
      spaces[key(x, y)] = value
    }
    else {
      console.log(`can't move at ${x}, ${y}`)
    }
  }

  return {
    clearBoard,
    newBoard,
    setMove,
    spaces};
})();