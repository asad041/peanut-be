const { v4: uuid } = require('uuid');
const logger = require('../logger');
const utils = require('../../helpers/utils');

function cleanQuery(query) {
  const clean = Object.assign({}, query);
  delete clean.password;
  return clean;
}

module.exports = (serviceName) => async (ctx, next) => {

  const llo = logger.logMeta.bind(null, { service: `${serviceName}:logger` });

  if (ctx.request.method === 'OPTIONS') {
    return next();
  }

  const correlationId = uuid();

  ctx.requestInfo = {
    start: Date.now(),
    correlationId,
    DeviceId: ctx.request.get('DeviceId'),
    path: ctx.request.path,
    method: ctx.request.method,
    ip: ctx.request.ip,
    route: ctx.request.route,
    url: ctx.request.url,
    host: ctx.request.host,
    protocol: ctx.request.protocol,
    origin: ctx.request.get('origin'),
  };

  ctx.requestInfo.query = cleanQuery(ctx.request.query);

  ctx.response.set('X-Correlation-Id', correlationId);
  // TODO use cls to send correlationID to microservices

  await next();

  if(utils.objectHasValue(ctx.request.body)) {

    const body = ctx.request.body;

    ctx.requestInfo.body = body;

  }


  ctx.requestInfo.status = ctx.status;
  ctx.requestInfo.time = Date.now() - ctx.requestInfo.start;

  let level = 'verbose';

  if (ctx.requestInfo.error) {
    if (ctx.requestInfo.error.exposeCustom_) {
      level = 'warn';
    } else {
      level = 'error';
    }
  }

  logger[level]('API request', llo(ctx.requestInfo));
};
