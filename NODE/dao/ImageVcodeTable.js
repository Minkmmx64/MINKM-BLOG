const { BaseRedisKeyValueAction } = require("./redis");
const { Client } = require('../config/redisServer');
class ImageAuthVcode extends BaseRedisKeyValueAction {

  constructor() {
    super("ImageAuthVcode");
  }

  HsetImg(k, v) {
    Client.hset("ImageAuthHashSet", k, v);
  }

  MsetImg(k, v) {
    Client.set(`${this.key}:'${k}'`, v);
    Client.expire(`${this.key}:'${k}'`, 60);
  }

  MgetImg(k) {
    return new Promise((r, j) => {
      Client.get(`${this.key}:'${k}'`, (e, d) => {
        if (d) r(d);
        else j(e);
      });
    });
  }

}

module.exports = ImageAuthVcode;