const log4js = require('log4js');
const logger = log4js.getLogger();
log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'file',
            filename: 'Debug.log',
        },
        layout: {
            type:"colored"
        }
    },
    categories: {
        default: {
            appenders: ['console', 'file'],
            level: 'debug'
        }
    }
});

module.exports = {
    logger
};