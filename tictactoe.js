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
    // The inner loop gets incremented first, so those keys
    // get created first, which means the inner loop has
    // to be your ROWS.
    for (let y = 1; y <= rows; y++) {
        for (let x = 1; x <= columns; x++) {
        // A primitive way to see how the cells are laid out
        // spaces[key(x, y)] = key(x, y);
        spaces[key(x, y)] = null;
      }
    }
  }

  const move = function(x, y, value) {
    // Can accept a specific player, or supplies its own
    if (!value) {
      value = activePlayer;
    }

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

  let turn = 0; // Fine as long as I don't want to print turns to the UI

  // Because we use modulo arithmetic to find the active player from the turn number,
  // the indexes need to be 0 upwards and regular, so an array is used
  const players = [
    {
      "side": "x",
      "who": "human",
    },
    {
      "side": "o",
      "who": "human",
    }
  ];
  const activePlayer = function(turn) {
    return (players[turn % players.length]);
  };

  return {
    clearBoard,
    newBoard,
    move,
    spaces,
    players,
    activePlayer};
})();

const controller = (() => {
  const move = function(x, y, value) {
    board.move(x, y, value);
  }

  return {move};
})(board);

/**
 * The interface between the DOM and the console-level Board
 * You set it up to use a particular element and particular board
 * @param {Element} el
 */
const surface = ((controller, board, el) => {
  /**
   * Consider splitting this into multiple draws if I don't want to
   * completely redraw every time?
   * @param {Element} el 
   */

  el.addEventListener("click", (e) => {
    // console.log("clicked!")
    const [x, y, keys] = getKeys(e.target)
    if (!keys) {
      return;
    }
    console.log(`Clicked on: ${keys}`)
    controller.move(x, y);
    drawBoard();
  })

  /**
   * 
   * @param {Element} element 
   * @return {string}
   */
  const getKeys = function(element) {
    const x = element.dataset.x;
    const y = element.dataset.y;
    if (!x | !y) {
      console.log("No key")
      return [null, null, null];
    }
    return [x, y, `${x},${y}`]

    // This previous version contained a bug; rather than a logical "and"
    // it performed a BITWISE "and" on the numeric values of the keys.
    // The result was that where there was no overlap between numbers ("1" & "2")
    // it claimed that the cell had no key.

    // console.table(x, y);
    // if (x & y) {
    //   return `${x},${y}`
    // }
    // else {
    //   console.log("No key");
    //   return null;
    // }
  }

  const drawBoard = function() {
    el.replaceChildren()
    for (const space in board.spaces) {
      let x, y;
      [x, y] = space.split(",");
      const cell = el.appendChild(doc.createElement("div"));
      cell.textContent = board.spaces[space];
      cell.setAttribute("class", "space");
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
    }
  }

  return {
    drawBoard
  };
})(controller, board, playArea);

// setup
board.newBoard();
board.move(1, 1, "x");
surface.drawBoard();
