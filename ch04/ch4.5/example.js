var canvas = document.getElementById("canvas");
const image = new Image();

const resetButton = document.getElementById("resetButton");
let imageData;
let mousedown = {},
  rubberbandRectangle = {},
  dragging = false;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function windowToCanvas(canvas, x, y) {
  var canvasRectangle = canvas.getBoundingClientRect();
  return { x: x - canvasRectangle.left, y: y - canvasRectangle.top };
}

function captureRubberbandPixels() {
  imageData = context.getImageData(
    rubberbandRectangle.left,
    rubberbandRectangle.top,
    rubberbandRectangle.width,
    rubberbandRectangle.height
  );
}

// Rubberband...
function rubberbandStart(x, y) {
  mousedown.x = x;
  mousedown.y = y;

  rubberbandRectangle.left = mousedown.x;
  rubberbandRectangle.top = mousedown.y;

  dragging = true;
}

function restoreRubberbandPixels() {
  let deviceWithOverCSSPixels = imageData.width / canvas.width,
    deviceHeightOverCSSPixels = imageData.height / canvas.height;

  context.putImageData(imageData, rubberbandRectangle.left, rubberbandRectangle.top);
}

function drawRubberband() {
  context.strokeRect(
    rubberbandRectangle.left + context.lineWidth,
    rubberbandRectangle.top + context.lineWidth,
    rubberbandRectangle.width - context.lineWidth * 2,
    rubberbandRectangle.height - context.lineWidth * 2
  );
}

function setRubberbandRectangle(x, y) {
  rubberbandRectangle.left = Math.min(x, mousedown.x);
  rubberbandRectangle.top = Math.min(y, mousedown.y);
  rubberbandRectangle.width = Math.abs(x - mousedown.x);
  rubberbandRectangle.height = Math.abs(y - mousedown.y);
}

function rubberbandStretch(x, y) {
  if (
    rubberbandRectangle.width > 2 * context.lineWidth &&
    rubberbandRectangle.height > 2 * context.lineWidth
  ) {
    if (imageData !== undefined) {
      restoreRubberbandPixels();
    }
  }
  setRubberbandRectangle(x, y);

  if (
    rubberbandRectangle.width > 2 * context.lineWidth &&
    rubberbandRectangle.height > 2 * context.lineWidth
  ) {
    updateRubberband();
  }
}

function rubberbandEnd() {
  context.drawImage(
    canvas,
    rubberbandRectangle.left + context.lineWidth * 2,
    rubberbandRectangle.top + context.lineWidth * 2,
    rubberbandRectangle.width - context.lineWidth * 4,
    rubberbandRectangle.height - context.lineWidth * 4,
    0,
    0,
    canvas.width,
    canvas.height
  );
  dragging = false;
  imageData = undefined;
}

function updateRubberband() {
  captureRubberbandPixels();
  drawRubberband();
}

// Event handlers...
canvas.onmousedown = function (e) {
  const loc = windowToCanvas(canvas, e.clientX, e.clientY);
  e.preventDefault();
  rubberbandStart(loc.x, loc.y);
};

canvas.onmousemove = function (e) {
  if (!dragging) return;
  console.log("is dragging");
  const loc = windowToCanvas(canvas, e.clientX, e.clientY);
  rubberbandStretch(loc.x, loc.y);
};

canvas.onmouseup = function (e) {
  e.preventDefault();
  rubberbandEnd();
};

// Initialization...

image.src = "../../shared/images/arch.png";
image.onload = function () {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

resetButton.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

context.strokeStyle = "navy";
context.lineWidth = 1.0;
