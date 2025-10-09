var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const RADIUS = 75;

// Function
const ball = new Sprite("ball", {
  paint: function (sprite, context) {
    context.beginPath();
    context.arc(
      sprite.left + sprite.width / 2,
      sprite.top + sprite.height / 2,
      RADIUS,
      0,
      Math.PI * 2,
      false
    );
    context.clip();

    context.shadowColor = "rgb(0,0,0)";
    context.shadowOffsetX = -4;
    context.shadowOffsetY = -4;
    context.shadowBlur = 8;

    context.strokeStyle = "rgba(100, 100, 195)";
    context.fillStyle = "rgba(30,144,255,0.15)";
    context.stroke();
    context.fill();
  },
});

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
