var canvas = document.getElementById("canvas");
const CENTROID_RADIUS = 10,
  CENTROID_STROKE_STYLE = "rgba(0,0,0,0.5)",
  CENTROID_FILL_STYLE = "rgba(80,190,240,0.6)",
  RING_INNER_RADIUS = 35,
  RING_OUTER_RADIUS = 55,
  ANNOTATION_FILL_STYLE = "rgba(0,0,230,0.9)",
  ANNOTATION_TEXT_SIZE = 12,
  TICK_WIDTH = 10,
  TICK_LONG_STROKE_STYLE = "rgba(100,140,230,0.9)",
  TICK_SHORT_STROKE_STYLE = "rgba(100,140,230,0.7)",
  TRACKING_DIAL_STROKING_STYLE = "rgba(100,140,230,0.5)",
  GUIDEWIRE_STROKE_STYLE = "goldenrod",
  GUIDEWIRE_FILL_STYLE = "rgba(250,250,0,0.6)";
let circle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 150,
};

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

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

function drawDial() {
  const loc = { x: circle.x, y: circle.y };
  drawCentroid();
  drawCentroidGuidewire(loc);
  drawRing();
}

function drawCentroid() {
  context.beginPath();
  context.save();
  context.strokeStyle = CENTROID_STROKE_STYLE;
  context.fillStyle = CENTROID_FILL_STYLE;
  context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI * 2, false);
  context.stroke();
  context.fill();
  context.restore();
}

function drawCentroidGuidewire(loc) {
  let angle = -Math.PI / 4,
    radius,
    endpt;
  radius = circle.radius + RING_OUTER_RADIUS;
  if (loc.x >= circle.x) {
    endpt = {
      x: circle.x + radius * Math.cos(angle),
      y: circle.y + radius * Math.sin(angle),
    };
  } else {
    endpt = {
      x: circle.x - radius * Math.cos(angle),
      y: circle.y - radius * Math.sin(angle),
    };
  }
  context.save();

  context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
  context.fillStyle = GUIDEWIRE_FILL_STYLE;

  context.beginPath();
  context.moveTo(circle.x, circle.y);
  context.lineTo(endpt.x, endpt.y);
  context.stroke();

  context.beginPath();
  context.strokeStyle = TICK_LONG_STROKE_STYLE;
  context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();

  context.restore();
}

function drawRing() {
	drawRingOuterCircle();
  context.strokeStyle = "rgba(0,0,0,0.1)";
  context.arc(
    circle.x,
    circle.y,
    circle.radius + RING_INNER_RADIUS,
    0,
    Math.PI * 2,
    false
  );
  context.fillStyle = "rgba(100,140,230,0.1)";
  context.fill();
  context.stroke();
}

function drawRingOuterCircle() {
  context.shadowColor = "rgba(0,0,0,0.7)";
  (context.shadowOffsetX = 3),
    (context.shadowOffsetY = 3),
    (context.shadowBlur = 6),
    (context.strokeStyle = TRACKING_DIAL_STROKING_STYLE);
  context.beginPath();
  context.arc(
    circle.x,
    circle.y,
    circle.radius + RING_OUTER_RADIUS,
    0,
    Math.PI * 2,
    true
  );
  context.stroke();
}

// Initialization...
drawGrid(context, "lightgray", 10, 10);
drawDial();
