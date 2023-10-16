"use strict";

const doc = document;
const playArea = doc.querySelector(".board");
const gameStatus = doc.querySelector(".status")

// We will have an MVC-type model:
// - view ("surface")
// - controller
// - model ("board")
// And I need to know if these things need, or even can,
// be declared in some particular order for dependency.
// I think the real answer is that I can declare them in literally any order,
// because they all exist in the global scope, so they can all be found by each other.

// If I had to be strict about it, how could I do it?
// Safe answer: Create objects without any dependencies, then link them to each
// other with different methods.

// Unsafe, case-by-case answer:
// playArea -> Surface
// Controller -> Surface (surface needs to know where it's sending instructions)
// Model -> Controller (controller needs to know where it's sending instructions)
// Model -> Surface (surface needs to know what it's drawing)
//    playArea / Model -> Controller -> Surface

// So if I wanted to ensure that the model itself wasn't presented to the user,
// the controller could have a the model itself inside it, and only certain
// methods ("safe" inputs and reading board state) would be available.

/**
 * Tests whether something is between (INCLUSIVE) two limits.
 * Use Infinity/-Infinity for unbounded limits!
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

const key = function(x, y){
  return `${x},${y}`;
}

const unKey = function(key) {
  return key.split(",")
}

/**
 * Given two arrays, adds them by element. The answer is the same length as the first argument.
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 * by River + Varn K on stackoverflow
 * https://stackoverflow.com/questions/7135874/element-wise-operations-in-javascript
 * I have added a "+" which forces the elements to be treated as numeric, otherwise
 * I get issues on my string-formatted values.
 */
const vecAdd = function(a, b) {
  return a.map((e,i) => + e + b[i]);
}


/**
 * Given a key-formatted vector and an array-vector, add them,
 * and return the new key. So that I can work directly on the keys as-is
 * with vector math.
 * @param {String} _key 
 * @param {Array} vector 
 */
const keyAdd = function(_key, vector) {
  const _ = unKey(_key);
  const [x, y] = vecAdd(_, vector)
  return key(x, y)
}

const board = (() => {
  // holds fundamental information on shape and board state
  // It doesn't know the rules of the game, it just takes locations and values and sets that.
  const rows = 3;
  const columns = 3;
  
  // I would prefer to express this as a map, but using arrays as keys (e.g. [2,1])
  // doesn't work as one would expect.
  const spaces = {};
  // spaces["1,1"] = "x";

  const clearBoard = function() {
    console.log("Board-clear not implemented");
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
    if (!((key(x, y)) in spaces)) {
      console.log(`can't move at ${x}, ${y}`);
      return;
    }
    else {
      spaces[key(x, y)] = value;
      return true;
    }
  }


  /**
   * Searches the board to see if a 3-long line (horz, vert, diagonal) of the
   * given type can be found. If so, says where. Else, false.
   * @param {String} side 
   * @returns {*}
   */
  const lineSearch = function(side) {
    // 

    return false;
  }

  /**
   * counts how many empty spaces are left on the board
   * @returns {Number}
   */
  const remainingSpaces = function() {
    const _ = Object.values(spaces) // array with just the values, not keys
    return (_.filter(x => x === null).length) // counting those that are null
  }

  return {
    clearBoard,
    newBoard,
    move,
    rows, // only ok because const
    columns, // only ok because const
    spaces, // A reference type, so it's OK
    lineSearch,
    remainingSpaces,
  };
})();

const controller = (() => {
  let _turn = 0; // Fine as long as I don't want to print turns to the UI
  const turn = function() {
    return _turn;
  }

  let gameResult = {
    // undefined when you can still play,
    // NULL on a draw!
    // winner: undefined,
    // method: undefined
    check: function() {
      // A win search can be done much more efficiently if you
      // specify the move that was JUST made.
  
      // An efficient universal search:
      // if your victory condition was 3-lines in any direction on
      // an arbitrarily large grid, then when you PLACE a mark,
      // first you find a description of all the paths that that new
      // mark is a part of, creating a 2d array of limited size.
      // so like the first row is the horizontal stripe, the second row is the left-slant...
      // then you have a 1d search in each of those for a sufficiently long chain.
  
      // because you can't win offturn, in this case we just check to see if the current player
      // has just won. If not, see if there are any empty spaces left on the board.
      // If there aren't any spaces left, the game is over.

      let line = board.lineSearch(activePlayer().side)
      if (line) {
        console.log("active player just won")
        this.winner = activePlayer.who;
        this.method = line;
      }
      else if (board.remainingSpaces() == 0) {
        console.log("no spaces left, game is over")
        this.winner = null
        this.method = "draw"
      }
    },
  };

  /**
   * Human-readable explanation of game status, derived from gameResult and whose turn it is
   * @returns {String}
   */
  const status = function() {
    if (gameResult.winner) {
      return `The winner is: ${gameResult.winner.who}`;
    }
    if (Object.is(gameResult.winner, null)) {
      return "The game is a draw!";
    }
    return `Current turn: ${activePlayer().side}`;
  }

  const players = [
    {
      "side": "x",
      "who": "human",
    },
    {
      "side": "o",
      "who": "computer",
    }
  ];
  const activePlayer = function() {
    return (players[turn() % players.length]);
  };

  /**
   * Calls whatever function it's given (usually controller.move())
   * followed by a UI update. It is recommended to use this, not move()
   * directly.
   * @param {Function} action 
   */
  const handle = function (action) {
    action();
    surface.drawBoard();
  }

  /**
   * Resolve an attempt to move, passing it on to the board object if valid.
   * Does not allow taking actions if game state would preclude that.
   * @param {String} x 
   * @param {String} y 
   * @param {String} value 
   * @returns null
   */
  const move = function(x, y, value = activePlayer().side) {
    // There's only two broad cases:
    // the first one is everything that would prevent a move actually being made,
    // and the second one is that a move GETS made and therefore the full checks for wincon need to happen.
    if (gameResult.winner) {
      return;
    }
    if (board.spaces[key(x, y)]) {
      console.log("Space is occupied!");
      return;
    }
    if (board.move(x, y, value)) { // board reports if the move was successfully applied
      gameResult.check()
      // This structure is a little funky. If you have a round-based
      // gameplay loop then that loop should be obvious... right?
      if (!gameResult.winner) {
        _turn++;
        if (activePlayer().who == "human") {
          return;
        }
        console.log("Pretend the AI is prompted to move here.")
        return;
        // if it's a human move now, just end
        // if it's an AI move now, just call its makeMove() method and end?
        // In a larger and more complex system, you'd fire an event or send a packet prompting
        // all relevant parties for moves and end the local process?
      }
    }

    // if you have a situation where you want to do shallow checks on
    // gamestate (e.g. computationally cheap stuff that happens on every
    // interaction) then you want to overhaul this process to be one-dimensional,
    // and put those updates at the end.

  }

  return {
    move,
    handle,
    players, // reference type, OK
    status,
    gameResult,
    activePlayer,
  };
})();

/**
 * The interface between the DOM and the console-level Board
 * You set it up to use a particular element and particular board
 * @param {Element} el
 */
const surface = ((el) => {
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
    // const action = controller.move.call(null, x, y);
    const action = controller.move.bind(null, x, y);
    controller.handle(action);
    // controller.move(x, y);
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
    gameStatus.textContent = controller.status();
  }

  return {
    drawBoard
  };
})(playArea);

// setup
board.newBoard();
// board.move(1, 1, "x");
surface.drawBoard();
