const { Client } = require('../config/redisServer');
class BaseRedisKeyValueAction {
    static key;

    constructor(key) {
        this.key = key;
        if (typeof key !== 'string' && this.key !== null && this.key !== undefined) {
            this.key = key.toString();
        }
    }

    setKeyValueSync(value) {
        return new Promise((resolve) => {
            Client.set(this.key, value, () => {
                resolve();
            });
        });
    }

    getKeyValueSync() {
        return new Promise((resolve, reject) => {
            Client.get(this.key, (err, replay) => {
                if (replay) {
                    resolve(replay);
                } else reject(err);
            });
        });
    }
}

module.exports = {
    BaseRedisKeyValueAction
};
