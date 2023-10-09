"use strict";

const doc = document;
const playArea = doc.querySelector(".board");
const gameStatus = doc.querySelector(".status")

playArea.addEventListener("click", (e) => { // relatively confident event handlers are safe
  console.log(`Clicked on thing!`)
  controller.handle();
})

// =========== bug should exist below the line ============

const controller = (() => {
  let _status = "Controller online..." // confirmed this line only runs once
  const status = function() {
    return _status;
  }

  const handle = function () {
    _status = "Your turn:";
    surface.drawBoard();
    console.log(status());
  }

  // The true cause of the bug is here, where members of the function
  // context are actually exposed in the returned object. If you return
  // function references, that's fine, but if you return one of the PRIMITIVE
  // properties, it gets immediately resolved, and that's all that the outside
  // will ever see.
  // Different variable, same name.

  return {
    handle,
    status,
  };
})();

const surface = (() => {
  const drawBoard = function() {
    console.log(controller.status());
    gameStatus.textContent = controller.status();
    // The "visible" part of the bug is that trying to access
    // controller.status from the outside (controller._status now)
    // will ONLY see he original value.
  }

  return {
    drawBoard
  };
})();