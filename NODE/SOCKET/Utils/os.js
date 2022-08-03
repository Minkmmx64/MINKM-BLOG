const os = require("os");

function OsComment() {
  console.log('你的剩余内存/M' + os.freemem() / 1024 / 1024);
  console.log('你的CPU' + os.arch());
}

module.exports = OsComment;

