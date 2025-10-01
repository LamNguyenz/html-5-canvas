const canvas = document.getElementById("canvas");
const startButton = document.getElementById("startButton");
const glasspane = document.getElementById("glasspane");
let pause = false;

/** @type {CanvasRenderingContext2D} */
const context = canvas && canvas.getContext("2d");

startButton.onclick = function (e) {
  e.preventDefault();
  pause = !pause;
  startButton.innterText = pause ? "Start" : "Pause";
};

glasspane.onmousedown = function (e) {
  e.preventDefault();
};

// Initialization...
