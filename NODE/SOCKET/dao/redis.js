const { Client } = require("./connect.config");
const UserOnlineList = "userOnlineList";//在线人数集合

//添加在线人数
const Sadd = (k, v) => {
  Client.sadd(k, v);
};
//删除在线人数
const Srem = (k, v) => {
  return new Promise((r, j) => {
    Client.srem(k, v, (e, d) => {
      if (e) {
        j(e);
      }
      r(d);
    });
  });
};
//统计在线人数
const Smembers = async (k) => {
  return new Promise((r, j) => {
    Client.smembers(k, (e, d) => {
      if (e) {
        j(e);
      }
      r(d);
    });
  });
};
module.exports = {
  Sadd,
  Srem,
  Smembers,
  UserOnlineList
};