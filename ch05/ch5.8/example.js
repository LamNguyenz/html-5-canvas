var canvas = document.getElementById("canvas");
const animationButton = document.getElementById("animateButton");

const sky = new Image();
const tree = new Image();
const nearTree = new Image();
const grass = new Image();
const grass2 = new Image();

let skyOffset = 0;
let grassOffset = 0;
let treeOffset = 0;
let nearTreeOffset = 0;

const SKY_VELOCITY = 8;
const TREE_VELOCITY = 20;
const FAST_TREE_VELOCITY = 40;
const GRASS_VELOCITY = 75;

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

  if (fps !== 0) {
    skyOffset = skyOffset < canvas.width ? skyOffset + SKY_VELOCITY / fps : 0;
    grassOffset =
      grassOffset < canvas.width ? grassOffset + GRASS_VELOCITY / fps : 0;
    treeOffset = treeOffset < canvas.width ? treeOffset + TREE_VELOCITY / fps : 0;
    nearTreeOffset =
      nearTreeOffset < canvas.width ? nearTreeOffset + FAST_TREE_VELOCITY / fps : 0;
  }

  // Sky
  context.save();
  context.translate(-skyOffset, 0);
  context.drawImage(sky, 0, 0);
  context.drawImage(sky, sky.width - 2, 0);
  context.restore();

  // Tree
  context.save();
  context.translate(-treeOffset, 0);
  context.drawImage(tree, 100, 240);
  context.drawImage(tree, 1100, 240);
  context.drawImage(tree, 400, 240);
  context.drawImage(tree, 1400, 240);
  context.drawImage(tree, 700, 240);
  context.drawImage(tree, 1700, 240);
  context.restore();

  // Near tree
  context.save();
  context.translate(-nearTreeOffset, 0);
  context.drawImage(nearTree, 250, 220);
  context.drawImage(nearTree, 1250, 220);
  context.drawImage(nearTree, 800, 220);
  context.drawImage(nearTree, 1800, 220);
  context.restore();

  // Grass
  context.save();
  context.translate(-grassOffset, 0);
  context.drawImage(grass, 0, canvas.height - grass.height);
  context.drawImage(grass, grass.width - 5, canvas.height - grass.height);
  context.drawImage(grass2, 0, canvas.height - grass2.height);
  context.drawImage(grass2, grass2.width, canvas.height - grass2.height);
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

tree.src = "../../shared/images/tree.png";
nearTree.src = "../../shared/images/tree-twotrunks.png";
grass.src = "../../shared/images/grass.png";
grass2.src = "../../shared/images/grass2.png";
sky.src = "../../shared/images/sky.png";

sky.onload = function () {
  draw();
};
