var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// let gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
let gradient = context.createRadialGradient(
  canvas.width / 2,
  canvas.height,
  10,
  canvas.width / 2,
  0,
  100,
);

gradient.addColorStop(0, "blue");
gradient.addColorStop(0.25, "white");
gradient.addColorStop(0.5, "purple");
gradient.addColorStop(0.75, "red");
gradient.addColorStop(1, "yellow");

context.fillStyle = gradient;
context.rect(0, 0, canvas.width, canvas.height);
context.fill();
// Initialization...
