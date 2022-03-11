const { configParser } = require('../src/helpers/utils');
const address  = require('./address');

const getConfigObject = (sourceConfig) => ({

  SITE_URL: configParser(sourceConfig, 'string', 'SITE_URL', address.SITE_URL),
  API_URL: configParser(sourceConfig, 'string', 'API_URL', address.API_URL),
  GECKO_API_URL: configParser(sourceConfig, 'string', 'GECKO_API_URL', address.GECKO_API_URL),

});

module.exports = {
  getConfigObject,
};
