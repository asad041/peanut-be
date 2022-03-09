const {configParser} = require('../src/helpers/utils');
const servicesConfig = require('./services');
const urlsConfig = require('./urls');

const getConfigObject = (sourceConfig) => ({

  APP_NAME: configParser(sourceConfig, 'string', 'APP_NAME', 'PeanutHub Test'),
  ENVIRONMENT: configParser(sourceConfig, 'string', 'ENVIRONMENT', 'development'),
  NODE_ENV: configParser(sourceConfig, 'string', 'NODE_ENV', 'development'),
  REMOTE_EXECUTION: configParser(sourceConfig, 'bool', 'REMOTE_EXECUTION', false),

  DB: {
    DB_NAME: configParser(sourceConfig, 'string', 'MONGODB_DB_NAME', 'db-peanut'),
    URI: configParser(sourceConfig, 'string', 'MONGODB_URI', 'mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs&retryWrites=true'),
    DEBUGGER: configParser(sourceConfig, 'bool', 'DB_DEBUGGER', false),
    RETRY_CONCURRENT_INTERVAL: configParser(sourceConfig, 'number', 'DATABASE_RETRY_CONCURRENT_INTERAVAL', 10),
    RETRY_CONCURRENT_WAIT_TIME: configParser(sourceConfig, 'number', 'DATABASE_RETRY_CONCURRENT_WAIT_TIME', 100),
  },

  LOG: {
    LEVEL: configParser(sourceConfig, 'string', 'LOG_LEVEL', 'verbose'),
    SENTRY_DSN: configParser(sourceConfig, 'string', 'LOG_SENTRY_DSN', null),
    CORALOGIX_KEY: configParser(sourceConfig, 'string', 'LOG_CORALOGIX_KEY', null),
    LOGENTRIES_KEY: configParser(sourceConfig, 'string', 'LOG_LOGENTRIES_KEY', null),
    LOGZIO_KEY: configParser(sourceConfig, 'string', 'LOG_LOGZIO_KEY', null),
    LOGZIO_SERVER_NAME: configParser(sourceConfig, 'string', 'LOG_LOGZIO_SERVER_NAME', 'backend'),
  },

  SERVICES: servicesConfig.getConfigObject(sourceConfig),
  URL: urlsConfig.getConfigObject(sourceConfig),
});

module.exports = {
  getConfigObject,
};
