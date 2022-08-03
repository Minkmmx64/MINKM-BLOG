const gm = require("gm").subClass({ imageMagick: true });

function game(file,l,t) {
  return new Promise((resolve, reject) => {
    gm(file)
      .resize(300, 200, "!")
      .crop(100, 100, l, t)
      .toBuffer((error, buffer) => {
      if (error) {
        reject(error);
      }else resolve("data:image/jpeg;base64," + buffer.toString("base64"));
    });
  });
}

module.exports = game;