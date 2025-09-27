var canvas = document.getElementById("canvas");
const readout = document.getElementById("readout");
const spritesheet = new Image();

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function windowToCanvas(canvas, x, y) {
  const bbox = canvas.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height),
  };
}

function drawBackground() {
  var VERTICAL_LINE_SPACING = 12,
    i = context.canvas.height;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "lightgray";
  context.lineWidth = 0.5;

  while (i > VERTICAL_LINE_SPACING * 4) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(context.canvas.width, i);
    context.stroke();
    i -= VERTICAL_LINE_SPACING;
  }
}

function drawSpriteSheet() {
  context.drawImage(spritesheet, 0, 0);
}

function drawGuideLine(x, y) {
  context.strokeStyle = "rgba(0, 0, 230, 0.8)";
  context.lineWidth = 0.5;
  drawHorizontalLine(y);
  drawVerticalLine(x);
}

function drawHorizontalLine(y) {
  context.beginPath();
  context.moveTo(0, y + 0.5);
  context.lineTo(context.canvas.width, y + 0.5);
  context.stroke();
}

function drawVerticalLine(x) {
  context.beginPath();
  context.moveTo(x + 0.5, 0);
  context.lineTo(x + 0.5, context.canvas.height);
  context.stroke();
}

function updateReadout(x, y) {
  if (!readout) return;
  readout.innerText = "(" + x.toFixed(0) + ", " + y.toFixed(0) + ")";
}

canvas.onmousemove = function (e) {
  var loc = windowToCanvas(canvas, e.clientX, e.clientY);

  drawBackground();
  drawSpriteSheet();
  drawGuideLine(loc.x, loc.y);
  updateReadout(loc.x, loc.y);
};

// Initialization...

spritesheet.src = "../../shared/images/running-sprite-sheet.png";
spritesheet.onload = function (e) {
  drawSpriteSheet();
};
drawBackground();
