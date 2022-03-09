const Transport = require('winston-transport');
const logzioNodejs = require('logzio-nodejs');
const Format = require('./format');
const config = require('../../../config');

class ExternalLogger extends Transport {
  constructor(opts) {
    super(opts);

    if(config.LOG.LOGZIO_KEY){

      this.logzioLogger = logzioNodejs.createLogger({
        token: config.LOG.LOGZIO_KEY,
        host: 'listener.logz.io',
        type: config.LOG.LOGZIO_SERVER_NAME,
        protocol: 'https',
      });

    }

    if(config.LOG.SENTRY_DSN){

      this.sentry = require('@sentry/node');
      this.sentry.init({
        dsn: config.LOG.SENTRY_DSN,
        serverName: config.LOG.LOGZIO_SERVER_NAME,
        environment: config.ENVIRONMENT
      });

    }

  }

  log(info, callback) {

    const msg = Format.formatMeta(info);

    if(this.logzioLogger){

      this.logzioLogger.log(msg);

    }

    if(info.level === 'error' && this.sentry && info.error instanceof Error && !info.error.exposeCustom_){

      info.error.message = `${info.message} - ${info.error.message}`;
      this.sentry.setExtra('info', info);
      this.sentry.captureMessage(info.error);

    }

    callback();

  }

  purge() {

    if(this.logzioLogger){

      this.logzioLogger.sendAndClose();

    }

    if(this.sentry){

      this.sentry.close();

    }

    return true;

  }

}

module.exports = ExternalLogger;
