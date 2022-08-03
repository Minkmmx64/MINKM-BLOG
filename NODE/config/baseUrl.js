const dotenv = require('dotenv');
dotenv.config('./env');
const BaseUrl = {
    test: {
        Url: "http://localhost:8000",
        Db: "mongodb://localhost:27017/",
        port: 8000
    },
    product: {
        Url: "http://blog.minkm.top:8000",
        Db: "mongodb://blog.minkm.top:3000/",
        port: 8000
    }
};
//测试地址
const isTest = true;
//通用地址
const Base = isTest ? BaseUrl.test : BaseUrl.product;
//用户头像上传路径
const userImgUrl = `${Base.Url}/chat/upload/img/chat_head/`;
//数据库地址
const MONGOD_URL = Base.Db + process.env.MONGO_DB;
//Redis 密码，端口号，Url
const BASE_REDIS = {
    REDIS_PSD: process.env.REDIS_PASS,
    REDIS_URL: process.env.REDIS_HOST,
    REDIS_PROT: process.env.REDIS_PORT
};
const MONGO_CONFIG = {
    auth: { "authSource": "admin" },
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS
};
module.exports = {
    userImgUrl,
    BASE_REDIS,
    MONGOD_URL,
    MONGO_CONFIG,
    BASE_PORT: Base.port
};