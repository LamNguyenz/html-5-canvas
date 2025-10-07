const canvas = document.getElementById("canvas");
const image = new Image();
const sunglassFilter = new Worker("./sunglassFilter.js");
const LENS_RADIUS = canvas.width / 5;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const offscreenCanvas = document.createElement("canvas");

/** @type {CanvasRenderingContext2D} */
const offscreenContext = offscreenCanvas.getContext("2d");

// Functions...
function drawLenses(leftLensLocation, rightLensLocation) {
  context.save();
  context.beginPath();

  context.arc(
    leftLensLocation.x,
    leftLensLocation.y,
    LENS_RADIUS,
    0,
    2 * Math.PI,
    false
  );
  context.stroke();

  context.moveTo(rightLensLocation.x + LENS_RADIUS, rightLensLocation.y);
  context.arc(
    rightLensLocation.x,
    rightLensLocation.y,
    LENS_RADIUS,
    0,
    2 * Math.PI,
    false
  );
  context.stroke();

  context.clip();
  context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
  context.restore();
}

function drawWire(center) {
  context.beginPath();
  context.moveTo(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2);
  context.quadraticCurveTo(
    center.x,
    center.y - LENS_RADIUS + 20,
    center.x + LENS_RADIUS / 4,
    center.y - LENS_RADIUS / 2
  );
  context.stroke();
}

function drawConnectors(center) {
  context.beginPath();

  context.fillStyle = "silver";
  context.strokeStyle = "rgba(0,0,0,0.4)";
  context.lineWidth = 2;

  context.arc(
    center.x - LENS_RADIUS / 4,
    center.y - LENS_RADIUS / 2,
    4,
    0,
    Math.PI * 2,
    false
  );
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(
    center.x + LENS_RADIUS / 4,
    center.y - LENS_RADIUS / 2,
    4,
    0,
    Math.PI * 2,
    false
  );
  context.fill();
  context.stroke();
}

function putSunglassesOn() {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  const leftLensLocation = {
    x: center.x - LENS_RADIUS - 10,
    y: center.y,
  };
  const rightLensLocation = {
    x: center.x + LENS_RADIUS + 10,
    y: center.y,
  };

  sunglassFilter.postMessage(imageData);
  sunglassFilter.onmessage = function () {
    offscreenContext.putImageData(event.data, 0, 0);
    drawLenses(leftLensLocation, rightLensLocation);
    drawWire(center);
    drawConnectors(center);
  };
}

function drawOriginalImage() {
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

// Event handlers...

image.onload = function () {
  drawOriginalImage();
  putSunglassesOn();
};

// Initialization...
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

image.src = "../../shared/images/curved-road.png";
