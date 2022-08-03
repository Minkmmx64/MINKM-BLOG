const { BaseRedisKeyValueAction } = require("./redis");
const { Client } = require('../config/redisServer');
class ApiMethodAndTime extends BaseRedisKeyValueAction {

  constructor(TableName) {
    super(TableName);
  }

  //入队
  LPUSH(t,m,v) {
    Client.lpush(`${this.key}:${t}:${m}`, v);
  }
  //统计
  LLEN(t, m) {
    return new Promise((r, j) => {
      Client.llen(`${this.key}:${t}:${m}`, (e, d) => {
        if (e) j(e);
        else r(d);
      });
    });
  }
  //获取全部
  LRANGE(t,m) {
    return new Promise((r, j) => {
      Client.lrange(`${this.key}:${t}:${m}`, 0, -1, (e, d) => {
        if (e) j(e);
        else r(d);
      });
    });
  }
}

module.exports = ApiMethodAndTime;