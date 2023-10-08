"use strict";

const doc = document;
const playArea = doc.querySelector(".board");

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
  const rows = 3;
  const columns = 3;
  
  const spaces = {};
  // spaces["1,1"] = "x";

  // questionable value
  const withinBorders = function(x, y){
    if ((between(x, 1, columns)) & between(y, 1, rows)) {
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
    for (let x = 1; x <= columns; x++) {
      for (let y = 1; y <= rows; y++) {
        spaces[key(x, y)] = null;
      }
    }
  }

  const setMove = function(x, y, value) {
    if (spaces[key(x, y)]) {
      console.log("Space is occupied!");
      return;
    }
    else if (!((key(x, y)) in spaces)) {
      console.log(`can't move at ${x}, ${y}`);
      return;
    }
    else {
      spaces[key(x, y)] = value;
      return true;
    }
  }

  /**
   * Consider splitting this into multiple draws if I don't want to
   * completely redraw every time?
   * @param {Element} el 
   */
  const drawBoard = function(el) {
    el.replaceChildren()
    for (const space in spaces) {
      let x, y;
      [x, y] = space.split(",");
      const cell = el.appendChild(doc.createElement("div"));
      cell.textContent = spaces[space];
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
    }
  }

  return {
    clearBoard,
    newBoard,
    setMove,
    drawBoard,
    spaces};
})();

// setup
board.newBoard();
board.setMove(1, 1, "x");
board.drawBoard(playArea);
