var canvas = document.getElementById("canvas");
let drawingSurfaceImageData;
const cursor = new TextCursor();
let blinkingInterval;
let line;

const BLINK_ON = 500,
  BLINK_OFF = 500;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function windowToCanvas(e) {
  const bbox = canvas?.getBoundingClientRect();
  return {
    x: e.clientX - bbox.left * (canvas.width / bbox.width),
    y: e.clientY - bbox.top * (canvas.height / bbox.height),
  };
}

function saveDrawingSurface() {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function blinkCursor(loc) {
  blinkingInterval = setInterval(() => {
    cursor.erase(context, drawingSurfaceImageData);

    setTimeout(function () {
      cursor.draw(context, cursor.left, cursor.top + cursor.getHeight(context));
    }, BLINK_OFF);
  }, BLINK_ON + BLINK_OFF);
}

// Text...
function moveCursor(loc) {
  cursor.erase(context, drawingSurfaceImageData);
  cursor.draw(context, loc.x, loc.y);

  if (!blinkingInterval) {
    blinkCursor(loc);
  }
}

// Event handler...
canvas.onmousedown = function (e) {
  const loc = windowToCanvas(e);
  let fontHeight = context.measureText("W").width;
  fontHeight += fontHeight / 6;
  line = new TextLine(loc.x, loc.y);
  moveCursor(loc);
};

document.onkeydown = function (e) {
  if (e.keyCode === 8 || e.keyCode === 13) {
    e.preventDefault();
  }

  if (e.keyCode === 8) {
    // backspace
    context.save();
  }
};

document.onkeypress = function (e) {
  const key = String.fromCharCode(e.which);
  if (e.keyCode !== 8 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();

    context.save();

    line.erase(context, drawingSurfaceImageData);
    line.insert(key);

    moveCursor(line.left + line.getWidth(context), line.bottom);

    line.draw(context);
    context.restore();
  }
};

// Initialization...
saveDrawingSurface();
