const { Client } = require('../config/redisServer');
const { BaseRedisKeyValueAction } = require('./redis');
class IpLimit extends BaseRedisKeyValueAction {
  constructor() {
    super();
  }

  sk(k) {
    Client.set(k, 1);
  }

  ek(k, t) {
    Client.expire(k, t);
  }

  gk(k) {
    return new Promise((r, j) => {
      Client.get(k, (e, d) => {
        if (e) j(e);
        r(d);
      });
    });
  }
}

module.exports = IpLimit;