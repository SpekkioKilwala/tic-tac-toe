"use strict";

const doc = document;
const playArea = doc.querySelector(".board");
const gameStatus = doc.querySelector(".status")

const board = (() => {
  const spaces = {
    "foo": null
  };

  const move = function(key, value) {
    spaces[key] = value;
    return true;
  }

  return {
    move,
    spaces,
  };
})();

const controller = (() => {
  let status = "Controller online..."

  const handle = function (action) {
    action();
    surface.drawBoard();
    console.log(status);
  }

  const move = function(x, y) {
    // Can accept a specific player, or supplies its own
    status = "Your turn:"
  }

  return {
    move,
    handle,
    status,
  };
})();

const surface = ((el) => {
  el.addEventListener("click", (e) => {
    const key = getKeys(e.target)
    if (!key) {
      return;
    }
    console.log(`Clicked on: ${key}`)
    const action = controller.move.bind(null, key);
    controller.handle(action);
  })

  /**
   * 
   * @param {Element} element 
   * @return {string}
   */
  const getKeys = function(element) {
    const key = element.dataset.x;
    if (!key) {
      console.log("No key")
      return null;
    }
    return key;
  }

  const drawBoard = function() {
    el.replaceChildren()
    for (const space in board.spaces) {
      const cell = el.appendChild(doc.createElement("div"));
      cell.textContent = board.spaces[space];
      cell.setAttribute("class", "space");
      cell.setAttribute("data-x", space);
    }
    console.log(controller.status);
    gameStatus.textContent = controller.status;
  }

  return {
    drawBoard
  };
})(playArea);

// setup
surface.drawBoard();
