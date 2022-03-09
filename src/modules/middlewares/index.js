const compose = require('koa-compose');
const cors = require('@koa/cors');
const charset = require('koa-charset');
const originHelper = require('../../helpers/origin');
const loggerMiddleware = require('./logger');
const errorMiddleware = require('./error');

module.exports = (serviceName, mainRouter) => compose([

  loggerMiddleware(serviceName),
  errorMiddleware(),
  charset(),

  cors({ origin: originHelper }),

  mainRouter.routes(),
  mainRouter.allowedMethods(),

]);
