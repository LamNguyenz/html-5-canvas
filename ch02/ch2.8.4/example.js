var canvas = document.getElementById("canvas");
const eraseAllButton = document.getElementById("eraseAllButton");
const strokeStyleSelect = document.getElementById("strokeStyleSelect");
const guidewireCheckbox = document.getElementById("guidewireCheckbox");
let drawingSurfaceImageData,
  mousedown = {},
  rubberbandRect = {},
  dragging = false,
  guidewires = guidewireCheckbox.checked;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function drawGrid(context, color, stepX, stepY) {
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

function windowToCanvas(x, y) {
  const bbox = canvas?.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height),
  };
}

function updateRubberbandRect(loc) {
  rubberbandRect.width = Math.abs(loc.x - mousedown.x);
  rubberbandRect.height = Math.abs(loc.y - mousedown.y);

  if (loc.x > mousedown.x) {
    rubberbandRect.left = mousedown.x;
  } else {
    rubberbandRect.left = loc.x;
  }

  if (loc.y > mousedown.y) {
    rubberbandRect.top = mousedown.y;
  } else {
    rubberbandRect.top = loc.y;
  }
}

function drawRubberbandShape(loc) {
  context.beginPath();
  context.moveTo(mousedown.x, mousedown.y);
  context.lineTo(loc.x, loc.y);
  context.stroke();
}

// Save and restore drawing surface...
function saveDrawingSurface() {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
  context.putImageData(drawingSurfaceImageData, 0, 0);
}

// Rubber bands....
function updateRubberband(loc) {
  updateRubberbandRect(loc);
  drawRubberbandShape(loc);
}

// Guidewires...
function drawHorizontalLine(y) {
  context.beginPath();
  context.moveTo(0, y + 0.5);
  context.lineTo(context.canvas.width, y + 0.5);
  context.stroke();
}

function drawVerticalLine(x) {
  context.beginPath();
  context.moveTo(x + 0.5, 0);
  context.lineTo(x + 0.5, context.canvas.height);
  context.stroke();
}

function drawGuidewires(x, y) {
  context.save();
  context.strokeStyle = "rgba(0,0,230,0.4)";
  context.lineWidth = 0.5;
  drawVerticalLine(x);
  drawHorizontalLine(y);
  context.restore();
}

// Canvas event handler...
canvas.onmousedown = (e) => {
  e.preventDefault();
  saveDrawingSurface();
  const loc = windowToCanvas(e.pageX, e.pageY);
  mousedown.x = loc.x;
  mousedown.y = loc.y;
  dragging = true;
};

canvas.onmousemove = (e) => {
  if (!dragging) return;
  e.preventDefault();

  let loc;
  loc = windowToCanvas(e.pageX, e.pageY);
  restoreDrawingSurface();
  updateRubberband(loc);

  if (guidewires) {
    drawGuidewires(loc.x, loc.y);
  }
};

canvas.onmouseup = (e) => {
  loc = windowToCanvas(e.pageX, e.pageY);
  restoreDrawingSurface();
  updateRubberband(loc);
  dragging = false;
};

// Controls event handlers...
guidewireCheckbox.onchange = function (e) {
  guidewires = e.target.checked;
};

strokeStyleSelect.onchange = function (e) {
  context.strokeStyle = e.target.value;
};

eraseAllButton.onclick = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(context, "lightgray", 10, 10);
};

// Initialization...
context.strokeStyle = strokeStyleSelect.value;
drawGrid(context, "lightgray", 10, 10);
