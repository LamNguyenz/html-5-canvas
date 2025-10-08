var canvas = document.getElementById("canvas");
const animationButton = document.getElementById("animateButton");
const sky = new Image();
const SKY_VELOCITY = 30;
let skyOffset = 0;

// FPS
let paused = true;
let lastTime = 0;
let fps = 0;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function erase() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  context.save();
  skyOffset =
    skyOffset < canvas.width && fps > 0 ? skyOffset + SKY_VELOCITY / fps : 0;
  context.translate(-skyOffset, 0);

  context.drawImage(sky, 0, 0);
  context.drawImage(sky, sky.width - 2, 0);

  context.restore();
}

function calculateFps() {
  const now = +new Date(),
    fps = 1000 / (now - lastTime);
  lastTime = now;
  return fps;
}

let lastFpsUpdateTime = 0,
  lastFpsUpdate = 0;
function drawFps() {
  const now = +new Date();
  fps = calculateFps();
  if (now - lastFpsUpdateTime >= 1000) {
    lastFpsUpdateTime = now;
    lastFpsUpdate = fps;
  }

  context.fillStyle = "cornflowerblue";
  context.fillText(lastFpsUpdate.toFixed() + " fps", 20, 60);
}

function animate(time) {
  if (!paused) {
    erase();
    draw();

    drawFps();
    window.requestAnimationFrame(animate);
  }
}

// Event handlers...
animationButton.onclick = function (e) {
  paused = paused ? false : true;
  if (paused) {
    animationButton.value = "Animate";
  } else {
    window.requestAnimationFrame(animate);
    animationButton.value = "Pause";
  }
};

// Initialization...
context.font = "48px Helvetica";

sky.src = "../../shared/images/sky.png";
sky.onload = function (e) {
  draw();
};
