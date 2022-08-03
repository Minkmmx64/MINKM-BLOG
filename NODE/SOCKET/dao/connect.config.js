const dotenv = require('dotenv');
dotenv.config('./env');

const redis = require('redis');

const BASE_REDIS = {
  REDIS_PSD: process.env.REDIS_PASS,
  REDIS_URL: process.env.REDIS_HOST,
  REDIS_PROT: process.env.REDIS_PORT
};

const Client = redis.createClient({
  port: BASE_REDIS.REDIS_PROT,
  host: BASE_REDIS.REDIS_URL,
  password: BASE_REDIS.REDIS_PSD
});

const MONGO_CONFIG = {
  auth: { "authSource": "admin" },
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS
};

const url = {
  test: "mongodb://localhost:27017",
  dev: "mongodb://blog.minkm.top:3000",
};
const userImgUrl = `${url.test}/chat/upload/img/chat_head/`;

const MONGO_PATH = `${url.test}/${process.env.MONGO_DB}`;

module.exports = { Client, MONGO_CONFIG, MONGO_PATH, userImgUrl };