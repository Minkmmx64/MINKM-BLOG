const os = require("os");

function memory() {
  return {
    percentage: ((1 - (os.freemem() / os.totalmem())) * 100).toFixed(2),
    cpu: os.type()
  };
}

module.exports = {
  memory
};