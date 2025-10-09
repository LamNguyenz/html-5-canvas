var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const CLOCK_RADIUS = canvas.width / 2 - 15;
const HOUR_HAND_TRUNCATE = 35;

// Function
const ballPainter = {
  paint: function (sprite, context) {
    const x = sprite.left + sprite.width / 2;
    const y = sprite.top + sprite.height / 2;
    const width = sprite.width,
      height = sprite.height,
      radius = sprite.width / 2;

    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.clip();

    context.shadowColor = "rgb(0,0,0)";
    context.shadowOffsetX = -4;
    context.shadowOffsetY = -4;
    context.shadowBlur = 8;
    context.fillStyle = "rgba(218,165,32,0.1)";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "rgb(100,100,195)";
    context.stroke();

    context.restore();
  },
};
const ball = new Sprite("ball", ballPainter);

function drawGrid(color, stepX, stepY) {
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

// Initialization...
drawGrid("lightgray", 10, 10);
ball.left = 320;
ball.top = 160;
ball.paint(context);
