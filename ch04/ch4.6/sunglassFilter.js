onmessage = function (event) {
  let imageData = event.data,
    data = imageData.data,
    length = data.length,
    width = imageData.width;

  for (let i = 0; i < length; i++) {
    if ((i + 1) % 4 !== 0) {
      if ((i + 4) % (width * 4) === 0) {
        data[i] = data[i - 4];
        data[i + 1] = data[i - 3];
        data[i + 2] = data[i - 2];
        data[i + 3] = data[i - 1];
      } else {
        data[i] = 2 * data[i] - 1.5 * data[i + 4];
      }
    }
  }
  postMessage(imageData);
};
