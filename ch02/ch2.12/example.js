var canvas = document.getElementById("canvas");
const editCheckbox = document.getElementById("editCheckbox");
const RADIUS = 100;

let drawingSurfaceImageData,
  mousedown = {},
  rubberBandRect = {},
  dragging = false,
  draggingOffsetX,
  draggingOffsetY,
  editing = false;

let Point = function (x, y) {
  this.x = x;
  this.y = y;
};

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Grids
function drawGrid(context, color, stepX, stepY) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 0.5;

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
  context.restore();
}

// Functions...
function windowToCanvas(x, y) {
  const bbox = canvas.getBoudnign;
}

// Save and restore drawing surface...
function saveDrawingSurface() {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
  context.putImageData(drawingSurfaceImageData, 0, 0);
}

// Draw polygon...
function getPolygonPoints(centerX, centerY, radius, sides, startAngle) {
  let points = [],
    angle = startAngle || 0;
  for (var i = 0; i < sides; i++) {
    points.push(
      new Point(
        centerX + radius * Math.cos(angle),
        centerY - radius * Math.sin(angle)
      )
    );
    angle += (2 * Math.PI) / sides;
  }
  return points;
}

function createPolygonPath(centerX, centerY, radius, sides, startAngle) {
  let points = getPolygonPoints(centerX, centerY, radius, sides, startAngle);

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < sides; ++i) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.closePath();
}

function drawRubberbandShape(loc, sides, startAngle) {
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  createPolygonPath(center.x, center.y, RADIUS, 8, 0);
  context.stroke();
}

// Dragging...
function startDragging(loc) {
  saveDrawingSurface();
  mousedown.x = loc.x;
  mousedown.y = loc.y;
}

function startEditing() {
  canvas.style.cursor = "pointer";
  editing = true;
}

function stopEditing() {
  canvas.style.cursor = "crosshair";
  editing = false;
}

// Event handlers...
canvas.onmousedown = function (e) {
  e.preventDefault();
  const loc = windowToCanvas(e.clientX, e.clientY);

  if (editing) {
    // Do something
  }
};

// Initialization..
drawGrid(context, "lightgray", 10, 10);
drawRubberbandShape();
