var canvas = document.getElementById("canvas");
const image = new Image();
image.src = "../../shared/images/curved-road.png";

const sunglassFilter = new Worker("./sunglassFilter.js");
let sunglassesOn = false;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

// Functions...
function negative() {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i <= data.length - 4; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  context.putImageData(imageData, 0, 0);
}

function blackAndWhite() {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i <= data.length - 4; i += 4) {
    const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = average;
    data[i + 1] = average;
    data[i + 2] = average;
  }
  context.putImageData(imageData, 0, 0);
}

function emboss() {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  const width = imageData.width;

  for (let i = 0; i < data.length - 4; i++) {
    if ((i + 1) % 4 !== 0) {
      data[i] = 255 / 2 + 2 * data[i] - data[i + 4] - data[i + width * 4];
    }
  }
  context.putImageData(imageData, 0, 0);
}

function putSunglassesOn() {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  sunglassFilter.postMessage(imageData);
  sunglassFilter.onmessage = function () {
    context.putImageData(event.data, 0, 0);
  };
}

function drawOriginalImage() {
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

// Event handlers...

image.onload = function () {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
	putSunglassesOn();
  // negative();
  // blackAndWhite();
  // emboss();
};

// Initialization...
