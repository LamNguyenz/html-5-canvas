const canvas = document.getElementById("canvas");
const rubberBandDiv = document.getElementById("rubberBandDiv");
const resetButton = document.getElementById("resetButton");
const image = new Image();
let mousedown = {},
  rubberbandRectangle = {};
let dragging = false;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function rubberbandStart(x, y) {
  mousedown.x = x;
  mousedown.y = y;

  rubberbandRectangle.left = mousedown.x;
  rubberbandRectangle.top = mousedown.y;

  moveRubberbandDiv();
  showRubberbandDiv();

  dragging = true;
}

function rubberbandStretch(x, y) {
  rubberbandRectangle.left = x < mousedown.x ? x : mousedown.x;
  rubberbandRectangle.top = y < mousedown.y ? y : mousedown.y;

  rubberbandRectangle.width = Math.abs(x - mousedown.x);
  rubberbandRectangle.height = Math.abs(y - mousedown.y);

  moveRubberbandDiv();
  resizeRubberbandDiv();
}

function moveRubberbandDiv() {
  rubberBandDiv.style.left = rubberbandRectangle.left + "px";
  rubberBandDiv.style.top = rubberbandRectangle.top + "px";
}

function showRubberbandDiv() {
  rubberBandDiv.style.display = "inline";
}

function hideRubberbandDiv() {
  rubberBandDiv.style.display = "none";
}

function resetRubberbandRectangle() {
  rubberbandRectangle = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
}

function resizeRubberbandDiv() {
  rubberBandDiv.style.width = rubberbandRectangle.width + "px";
  rubberBandDiv.style.height = rubberbandRectangle.height + "px";
}

function rubberbandEnd() {
  const bbox = canvas?.getBoundingClientRect();

  try {
    context.drawImage(
      canvas,
      rubberbandRectangle.left - (bbox.left + window.pageXOffset),
      rubberbandRectangle.top - (bbox.top + window.pageYOffset),
      rubberbandRectangle.width,
      rubberbandRectangle.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  } catch (error) {
    // Suppress error message when mouse is release
    // outside the canvas
  }


  resetRubberbandRectangle();

  rubberBandDiv.style.width = 0;
  rubberBandDiv.style.height = 0;

  hideRubberbandDiv();

  dragging = false;
}

canvas.onmousedown = function (e) {
  const x = e.pageX,
    y = e.pageY;
  e.preventDefault();
  rubberbandStart(x, y);
};

window.onmousemove = function (e) {
  const x = e.pageX,
    y = e.pageY;
  e.preventDefault();
  if (dragging) {
    rubberbandStretch(x, y);
  }
};

window.onmouseup = function (e) {
  e.preventDefault();
  rubberbandEnd();
};

image.onload = function () {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

resetButton.onclick = function(e) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.drawImage(image, 0, 0, canvas?.clientWidth, canvas.height);
}

// Initialization...
image.src = "../../shared/images/curved-road.png";
