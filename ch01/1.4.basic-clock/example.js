var canvas = document.getElementById("canvas");
var FONT_HEIGHT = 15,
  MARGIN = 35,
  HAND_TRUNCATION = canvas.width / 25,
  HOUR_HAND_TRUNCATION = canvas.width / 10,
  NUMERAL_SPACING = 20,
  RADIUS = canvas.width / 2 - MARGIN,
  HAND_RADIUS = RADIUS + NUMERAL_SPACING;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

function drawCircle() {
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
  context.stroke();
}

function drawNumerals() {
  let numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    angle = 0,
    numeralWidth = 0;
  numerals.forEach((numeral) => {
    angle = (Math.PI / 6) * numeral;
    numeralWidth = context.measureText(numeral).width;
    context.fillText(
      numeral,
      canvas.width / 2 + Math.sin(angle) * HAND_RADIUS - numeralWidth / 2,
      canvas.height / 2 - Math.cos(angle) * HAND_RADIUS + FONT_HEIGHT / 3
    );
  });
}

function drawCenter() {
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
  context.fill();
}

function drawHand(loc, isHour) {
  let angle = (Math.PI / (6 * 5)) * loc;
  let handRadius = isHour
    ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION
    : RADIUS - HAND_TRUNCATION;

  context.beginPath();
  context.moveTo(canvas.width / 2, canvas.height / 2);
  context.lineTo(
    canvas.width / 2 + Math.sin(angle) * handRadius,
    canvas.height / 2 - Math.cos(angle) * handRadius
  );
  context.stroke();
}

function drawHands() {
  var date = new Date(),
    hour = date.getHours();
  hour = hour > 12 ? hour - 12 : hour;
  drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true);
  drawHand(date.getMinutes(), false);
  drawHand(date.getSeconds(), false);
}

function drawClock() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawCircle();
  drawCenter();
  drawNumerals();
  drawHands();
}

// Initialization...
context.font = FONT_HEIGHT + "px Arial";
loop = setInterval(drawClock, 1000);
