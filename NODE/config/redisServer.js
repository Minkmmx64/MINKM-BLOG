const { BASE_REDIS } = require('./baseUrl');
const redis = require('redis');

const Client = redis.createClient({
    port: BASE_REDIS.REDIS_PROT,
    host: BASE_REDIS.REDIS_URL,
    password: BASE_REDIS.REDIS_PSD
});

const ClientConnect = () => {
    return new Promise((resolve, reject) => {
        Client.on("connect", () => {
            console.log('REDIS connect success');
            resolve("REDIS connect success");
        }).on("error", () => {
            console.log("REDIS connect error");
            reject("REDIS connect error");
        });
    });
};
module.exports = { ClientConnect, Client };