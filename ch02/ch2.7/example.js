var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function drawGrid() {
  context.strokeStyle = "gray";
  context.lineWidth = 0.5;

  const stepX = 10,
    stepY = 10;
  for (let i = stepX; i < context.canvas.width; i += stepX) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, context.canvas.height);
    context.stroke();
  }

  for (let i = stepY; i < context.canvas.height; i += stepY) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(context.canvas.width, i);
    context.stroke();
  }
}

function drawTwoArc() {
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2, false);

  context.arc(canvas.width / 2, canvas.height / 2, 100, Math.PI * 2, 0, true);
  context.stroke();
	context.fill();
}

function draw() {
	context.clearRect(0, 0, canvas?.width, canvas.height);
	drawGrid();

	context.save();

	context.shadowColor = 'rgba(0,0,0,0.8)'
	context.shadowOffsetX = 12;
	context.shadowOffsetY = 12;
	context.shadowBlur = 15;

	drawTwoArc();

	context.restore();
}

// Initialization...
context.fillStyle = 'rgba(100, 140, 230, 0.5)'
context.strokeStyle = context.fillStyle;
draw();
