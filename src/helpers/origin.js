const config = require('../../config');
const errors = require('./errors');

module.exports = (ctx) => {

  const requestOrigin = ctx.accept.headers.origin;

  if (config.SERVICES.API.CORS.length > 0 && !config.SERVICES.API.CORS.includes(requestOrigin)) {

    errors.throwExposable('invalid_origin');

  }

  return requestOrigin;

};
