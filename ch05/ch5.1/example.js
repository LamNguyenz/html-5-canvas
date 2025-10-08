var canvas = document.getElementById("canvas");
let paused = true;
let discs = [
  {
    x: 150,
    y: 250,
    lastX: 150,
    lastY: 250,
    velocityX: -3.2,
    velocityY: 3.5,
    radius: 25,
    innerColor: "rgba(255,255,0,1)",
    middleColor: "rgba(255,255,0,0.7)",
    outerColor: "rgba(255,255,0,0.5)",
    strokeStyle: "gray",
  },
  {
    x: 50,
    y: 150,
    lastX: 50,
    lastY: 150,
    velocityX: 2.2,
    velocityY: 2.5,
    radius: 25,
    innerColor: "rgba(100,145,230,1.0)",
    middleColor: "rgba(100,145,230,0.7)",
    outerColor: "rgba(100,145,230,0.5)",
    strokeStyle: "blue",
  },
  {
    x: 150,
    y: 75,
    lastX: 150,
    lastY: 75,
    velocityX: 1.2,
    velocityY: 1.5,
    radius: 25,
    innerColor: "rgba(255,0,0,1.0)",
    middleColor: "rgba(255,0,0,0.7)",
    outerColor: "rgba(255,0,0,0.5)",
    strokeStyle: "orange",
  },
];
let lastTime = 0;

let numDiscs = discs.length;
const animationButton = document.getElementById("animateButton");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function drawBackground() {
  // Implementation
}

function update() {
  var disc = null;

  for (let i = 0; i < numDiscs; i++) {
    disc = discs[i];

    if (
      disc.x + disc.velocityX + disc.radius > context.canvas.width ||
      disc.x + disc.velocityX - disc.radius < 0
    ) {
      disc.velocityX = -disc.velocityX;
    }

    if (
      disc.y + disc.velocityY + disc.radius > context.canvas.height ||
      disc.y + disc.velocityY - disc.radius < 0
    ) {
      disc.velocityY = -disc.velocityY;
    }
    disc.x += disc.velocityX;
    disc.y += disc.velocityY;
  }
}

function draw() {
  for (let i = 0; i < numDiscs; i++) {
    disc = discs[i];

    gradient = context.createRadialGradient(
      disc.x,
      disc.y,
      0,
      disc.x,
      disc.y,
      disc.radius
    );

    gradient.addColorStop(0.3, disc.innerColor);
    gradient.addColorStop(0.5, disc.middleColor);
    gradient.addColorStop(1, disc.outerColor);

    context.save();
    context.beginPath();
    context.arc(disc.x, disc.y, disc.radius, 0, Math.PI * 2, false);
    context.fillStyle = gradient;
    context.strokeStyle = disc.strokeStyle;
    context.fill();
    context.stroke();
    context.restore();
  }
}

function calculateFps() {
  const now = +new Date(),
    fps = 1000 / (now - lastTime);
  lastTime = now;
  return fps;
}

let lastFpsUpdateTime = 0,
  lastFpsUpdate = 0;
function animate(time) {
  let fps = 0;
  const now = +new Date();
  if (!paused) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    update();
    draw();

    fps = calculateFps();
    if (now - lastFpsUpdateTime >= 1000) {
      lastFpsUpdateTime = now;
      lastFpsUpdate = fps;
    }

    context.fillStyle = "cornflowerblue";
    context.fillText(lastFpsUpdate.toFixed() + " fps", 20, 60);

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
draw();
