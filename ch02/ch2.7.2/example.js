var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function drawGrid() {
  context.strokeStyle = "gray";
  context.lineWidth = 0.5;

  const stepX = 10,
    stepY = 10;
  for (let i = stepX + 0.5; i < context.canvas.width; i += stepX) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, context.canvas.height);
    context.stroke();
  }

  for (let i = stepY + 0.5; i < context.canvas.height; i += stepY) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(context.canvas.width, i);
    context.stroke();
  }
}

function addOuterRectangle() {
  context.rect(110, 25, 370, 335);
}

function rect(x, y, w, h, direction) {
  if (direction) { // CCW
    context.moveTo(x, y);
    context.lineTo(x, y + h);
    context.lineTo(x + w, y + h);
    context.lineTo(x + w, y);
  } else {
    context.moveTo(x, y);
    context.lineTo(x + w, y);
    context.lineTo(x + w, y + h);
    context.lineTo(x, y + h);
  }
  context.closePath();
}

function addRectPath () {
  rect(300, 35, 70, 35, true);
}

function addCirclePath() {
  context.moveTo(canvas.width/2 + 40, 300);
  context.arc(canvas.width / 2, 300, 40, 0, Math.PI * 2, true);
}

function addTriangle() {
  context.moveTo(200, 200);
  context.lineTo(400, 200);
  context.lineTo(230, 120);
  context.fill();
  context.closePath();
}

function drawCutouts() {
  context.save();
  context.beginPath();
  context.strokeStyle = "rgba(0,0,0,0.7)";
  context.fillStyle = "goldenrod";

  context.beginPath();
  addOuterRectangle();

  addRectPath();
  addCirclePath();
  addTriangle();

  context.fill();
  context.stroke();
  context.restore();
}

// Initialization...
drawGrid();
drawCutouts();
