const { BaseRedisKeyValueAction } = require("./redis");
const { Client } = require('../config/redisServer');
class CommentApiMonitor extends BaseRedisKeyValueAction {

  constructor() {
    super("CommentApiMonitor");
  }

  //入队
  LPUSH(v) {
    Client.lpush(this.key, v);
  }
  //出队
  LRPOP(number) {
    return new Promise((r, j) => {
      Client.brpop(this.key, number, (e, d) => {
        if (e) j(e);
        else r(d);
      });
    });
  }
  //统计
  LLEN() {
    return new Promise((r, j) => {
      Client.llen(this.key, (e, d) => {
        if (e) j(e);
        else r(d);
      });
    });
  }
  //获取全部
  LRANGE() {
    return new Promise((r, j) => {
      Client.lrange(this.key, 0, -1, (e, d) => {
        if (e) j(e);
        else r(d);
      });
    });
  }
  //统计在线人数
  Smembers() {
    return new Promise((r, j) => {
      Client.smembers("userOnlineList", (e, d) => {
        if (e) {
          j(e);
        }
        r(d);
      });
    });
  }
}

module.exports = CommentApiMonitor;