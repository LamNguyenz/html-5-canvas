var canvas = document.getElementById("canvas");
const PADDING = 100;
const RADIUS = canvas.width / 2 - PADDING;

let Point = function (x, y) {
  this.x = x;
  this.y = y;
};

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
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

// Initialization..

drawRubberbandShape();
