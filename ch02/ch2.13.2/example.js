var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// initialization..
context.fillStyle = 'hsl(240, 50%, 50%)';
context.fillRect(0, 0, canvas.width, canvas.height);

const family = getComputedStyle(canvas).fontFamily;
context.font = `100px ${family}`
context.fillStyle = 'white';
context.textAlign = "center";
context.textBaseline = "middle";
let sin = Math.sin(0);
let cos = Math.cos(0);

context.save();
context.translate(canvas.width / 2, canvas.height / 2);
context.transform(cos, sin, -sin, cos, 0, 0);
context.fillText("Spinning", 0, 0);
context.restore();