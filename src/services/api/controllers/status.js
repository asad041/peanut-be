const config = require('../../../../config');
const logger = require('../../../modules/logger');
const moment = require('moment');

/*eslint-disable no-unused-vars*/
const llo = logger.logMeta.bind(null, {service: 'api:controllers:status'});

module.exports = {

  get: async () => ({
    status: 'healthy',
    appName: config.APP_NAME,
    environment: config.ENVIRONMENT,
    time: moment().format(),
  }),

};
