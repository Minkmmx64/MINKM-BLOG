const log4js = require('log4js');
const logger = log4js.getLogger();
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'file',
      filename: 'chatDebug.log',
    }
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: 'debug'
    }
  }
});
module.exports = logger;