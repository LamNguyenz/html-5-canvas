var canvas = document.getElementById("canvas");
const scoreboard = document.getElementById("scoreboard");
const launchAngleOutput = document.getElementById("launchAngleOutput");
const launchVelocityOutput = document.getElementById("launchVelocityOutput");
let elapsedTime = undefined,
  launchTime = undefined;
let score = 0,
  lastScore = 0,
  lastMouse = { left: 0, top: 0 };
let threePointer = false,
  needInstructions = true;

let bucketImage = new Image();

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

let LAUNCHPAD_X = 50,
  LAUNCHPAD_Y = context.canvas.height - 50,
  LAUNCHPAD_WIDTH = 50,
  LAUNCHPAD_HEIGHT = 12,
  BALL_RADIUS = 8,
  ARENA_LENGTH_IN_METERS = 10,
  INITIAL_LAUNCH_ANGLE = Math.PI / 4,
  launchAngle = INITIAL_LAUNCH_ANGLE,
  pixelsPerMeter = canvas.width / ARENA_LENGTH_IN_METERS;

var ball,
  ballInFlight = false,
  launchVelocity = 0;

// Launch pad....
let launchpadPainter = {
  LAUNCHPAD_FILL_STYLE: "rgb(100,140,230)",
  paint: function (ledge, context) {
    context.save();
    context.fillStyle = this.LAUNCHPAD_FILL_STYLE;
    context.fillRect(LAUNCHPAD_X, LAUNCHPAD_Y, LAUNCHPAD_WIDTH, LAUNCHPAD_HEIGHT);
    context.restore();
  },
};
let launchPad = new Sprite("launchPad", launchpadPainter);

// Balls....
let ballPainter = {
  BALL_FILL_STYLE: "rgb(255,255,0)",
  BALL_STROKE_STYLE: "rgba(0,0,0,0.4)",
  paint: function (ball, context) {
    context.save();
    context.shadowColor = undefined;
    context.lineWidth = 2;
    context.fillStyle = this.BALL_FILL_STYLE;
    context.strokeStyle = this.BALL_STROKE_STYLE;

    context.beginPath();
    context.arc(ball.left, ball.top, ball.radius, 0, Math.PI * 2, false);

    context.clip();
    context.fill();
    context.stroke();
    context.restore();
  },
};

// Lob behavior...
let lob = {
  lastTime: 0,
  GRAVITY_FORCE: 9.81, // m/s/s

  applyGravity: function (elapsed) {
    ball.velocityY =
      this.GRAVITY_FORCE * elapsed - launchVelocity * Math.sin(launchAngle);
  },

  updateBallPosition: function (updateDelta) {
    ball.left += ball.velocityX * updateDelta * pixelsPerMeter;
    ball.top += ball.velocityY * updateDelta * pixelsPerMeter;
  },

  checkForThreePointer: function () {
    if (ball.top < 0) {
      threePointer = true;
    }
  },

  checkBallBounds: function () {
    if (ball.top > canvas.height || ball.left > canvas.width) {
      reset();
    }
  },
  execute: function (ball, context, time) {
    var updateDelta, elapsedFlightTime;

    if (ballInFlight) {
      if (launchTime === undefined) launchTime = time;
      (elapsedFrameTime = (time - this.lastTime) / 1000),
        (elapsedFlightTime = (time - launchTime) / 1000);

      this.applyGravity(elapsedFlightTime);
      this.updateBallPosition(elapsedFrameTime);
      this.checkForThreePointer();
      this.checkBallBounds();
    }
    this.lastTime = time;
  },
};

ball = new Sprite("ball", ballPainter, [lob]);
ballInFlight = false;

// Buckets...
let catchBall = {
  ballInBucket: function () {
    return (
      ball.left > bucket.left + bucket.width / 2 &&
      ball.left < bucket.left + bucket.width &&
      ball.top > bucket.top &&
      ball.top < bucket.top + bucket.height / 3
    );
  },
  adjustScore: function () {
    if (threePointer) lastScore = 3;
    else lastScore = 2;
    score += lastScore;
    scoreboard.innerText = score;
  },
  execute: function (bucket, context, time) {
    if (ballInFlight && this.ballInBucket()) {
      reset();
      this.adjustScore();
    }
  },
};
let bucketPaint = {
  BUCKET_X: 668,
  BUCKET_Y: canvas.height - 100,
  paint: function (sprite, context) {
    context.drawImage(bucketImage, this.BUCKET_X, this.BUCKET_Y);
  },
};
let bucket = new Sprite("bucket", bucketPaint);

// Functions...
function windowToCanvas(x, y) {
  var bbox = canvas.getBoundingClientRect();

  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height),
  };
}

function reset() {
  ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH / 2;
  ball.top = LAUNCHPAD_Y + ball.height / 2;
  ball.velocityX = 0;
  ball.velocityY = 0;
  ballInFlight = false;
  needInstructions = false;
  lastScore = 0;
}

function drawGuidewire() {
  context.moveTo(ball.left, ball.top);
  context.lineTo(lastMouse.left, lastMouse.top);
  context.stroke();
}

function updateSprites(time) {
  bucket.update(context, time);
  launchPad.update(context, time);
  ball.update(context, time);
}

function paintSprites() {
  launchPad.paint(context);
  bucket.paint(context);
  ball.paint(context);
}

// Event handlers...
canvas.onmousedown = function (e) {
  let rect;
  e.preventDefault();

  if (!ballInFlight) {
    ball.velocityX = launchVelocity * Math.cos(launchAngle);
    ball.velocityY = launchVelocity * Math.sin(launchAngle);
    ballInFlight = true;
    threePointer = false;
    launchTime = undefined;
  }
};

canvas.onmousemove = function (e) {
  let rect;
  e.preventDefault();
  if (!ballInFlight) {
    const loc = windowToCanvas(e.clientX, e.clientY);
    lastMouse.left = loc.x;
    lastMouse.top = loc.y;

    let deltaX = Math.abs(lastMouse.left - ball.left);
    let deltaY = Math.abs(lastMouse.top - ball.top);

    launchAngle = Math.atan(parseFloat(deltaY) / parseFloat(deltaX));
    launchVelocity = (4 * deltaY) / Math.sin(launchAngle) / pixelsPerMeter;
    launchVelocityOutput.innerText = launchVelocity.toFixed(2);
    launchAngleOutput.innerText = ((launchAngle * 180) / Math.PI).toFixed(2);
  }
};

// Animation loop
function animate(time) {
  elapsedTime = (time - launchTime) / 1000;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!ballInFlight) {
    drawGuidewire();
  }

  updateSprites(time);
  paintSprites();

  window.requestNextAnimationFrame(animate);
}

// Initialization...
ball.width = BALL_RADIUS * 2;
ball.height = ball.width;
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH / 2;
ball.top = LAUNCHPAD_Y + ball.height / 2;
ball.radius = BALL_RADIUS;

context.lineWidth = 0.5;
context.strokeStyle = "rgba(0,0,0,0.5)";
context.shadowColor = "rgba(0,0,0,0.5)";
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;
context.stroke();

bucketImage.src = "../../shared/images/bucket.png";
bucketImage.onload = function (e) {
  bucket.left = bucketPaint.BUCKET_X;
  bucket.top = bucketPaint.BUCKET_Y;
  bucket.width = bucketImage.width;
  bucket.height = bucketImage.height;
};
window.requestNextAnimationFrame(animate);
