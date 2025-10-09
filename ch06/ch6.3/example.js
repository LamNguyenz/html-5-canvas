var canvas = document.getElementById("canvas");
const animateButton = document.getElementById("animateButton");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const spritesheet = new Image();
const runnerCells = [
  { left: 0, top: 0, width: 47, height: 64 },
  { left: 55, top: 0, width: 44, height: 64 },
  { left: 107, top: 0, width: 39, height: 64 },
  { left: 150, top: 0, width: 46, height: 64 },
  { left: 208, top: 0, width: 49, height: 64 },
  { left: 265, top: 0, width: 46, height: 64 },
  { left: 320, top: 0, width: 42, height: 64 },
  { left: 380, top: 0, width: 35, height: 64 },
  { left: 425, top: 0, width: 35, height: 64 },
];
const runInPlace = {
  lastAdvance: 0,
  PAGEFLIP_INTERVAL: 100,
  execute: function (sprite, context, now) {
    if (now - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
      sprite.painter.advance();
      this.lastAdvance = now;
    }
  },
};
const moveLeftToRight = {
  lastMove: 0,
  execute: function (sprite, context, time) {
    if (this.lastMove !== 0) {
      sprite.left -= sprite.velocityX * ((time - this.lastMove) / 1000);
      if (sprite.left < 0) {
        sprite.left = canvas.width;
      }
    }
    this.lastMove = time;
  },
};

const sprite = new Sprite("runner", new SpriteSheetPainter(runnerCells), [
  runInPlace,
  moveLeftToRight,
]);
let paused = false,
  interval,
  lastAdvance = 0,
  PAGEFLIP_INTERVAL = 100;

// Functions...
function drawBackground() {
  let STEP_Y = 12,
    i = context.canvas.height;

  while (i > STEP_Y * 4) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(canvas.width, i);
    context.stroke();
    i -= STEP_Y;
  }
}

function pauseAnimation() {
  animateButton.value = "Animate";
  paused = true;
}

function startAnimation() {
  animateButton.value = "Pause";
  paused = false;
  lastAdvance = +new Date();
  window.requestAnimationFrame(() => animate(+new Date()));
}

// Animation...
function animate(time) {
  if (!paused) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    context.drawImage(spritesheet, 0, 0);

    sprite.update(context, time);
    sprite.paint(context);

    window.requestAnimationFrame(() => animate(+new Date()));
  }
}

// Event handlers...
animateButton.onclick = function (e) {
  if (animateButton.value === "Animate") startAnimation();
  else pauseAnimation();
};

// Initialization...
spritesheet.src = "../../shared/images/running-sprite-sheet.png";
spritesheet.onload = function (e) {
  context.drawImage(spritesheet, 0, 0);
};

sprite.velocityX = 50;
sprite.left = 200;
sprite.top = 100;

context.strokeStyle = "lightgray";
context.lineWidth = 0.5;

drawBackground();
