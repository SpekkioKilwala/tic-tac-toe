"use strict";

const doc = document;
const playArea = doc.querySelector(".board");
const gameStatus = doc.querySelector(".status")

const controller = (() => {
  let status = "Controller online..."

  const handle = function () {
    status = "Your turn:";
    surface.drawBoard();
    console.log(status);
  }

  return {
    handle,
    status,
  };
})();

const surface = ((el) => {
  el.addEventListener("click", (e) => {
    console.log(`Clicked on thing!`)
    controller.handle();
  })

  const drawBoard = function() {
    console.log(controller.status);
    gameStatus.textContent = controller.status;
  }

  return {
    drawBoard
  };
})(playArea);

// setup
surface.drawBoard();
