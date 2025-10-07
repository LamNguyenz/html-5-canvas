var canvas = document.getElementById("canvas");
const image = new Image();

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function drawImage() {
  const scale = 2;
  const w = canvas.width,
    h = canvas.height,
    sw = w * scale,
    sh = h * scale;
  context.clearRect(0, 0, w, h);
  context.drawImage(image, -(sw - w) / 2, -(sh - h) / 2, sw, sh);
}

// Initialization...
context.fillStyle = "cornflowerblue";
context.strokeStyle = "yellow";
context.shadowColor = "rgba(50, 50, 50, 1.0)";
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 10;
image.src = "../../shared/images/waterfall.png";

image.onload = function (e) {
  drawImage();
};