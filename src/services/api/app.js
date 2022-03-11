const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const MainAuthMiddleware = require('../../modules/middlewares/index');
const logger = require('../../modules/logger/index');
const config = require('../../../config');
const mainRouters = require('./routers');

const serviceName = 'api';
const llo = logger.logMeta.bind(null, { service: serviceName });

const API = () =>
  new Promise((resolve, reject) => {
    const app = new Koa();

    app.proxy = config.REMOTE_EXECUTION;

    app.on('error', (error) => {
      logger.error('Unexpected API error', { error });
    });

    require('koa-ctx-cache-control')(app);

    app.use((ctx, next) => {
      ctx.cacheControl(false);
      return next();
    });

    app.use(bodyParser({ enableTypes: ['json'] }));

    app.use(MainAuthMiddleware(serviceName, mainRouters.router()));

    const server = app.listen(config.SERVICES.API.PORT, (err) => {
      if (err) {
        return reject(err);
      }

      logger.info('Listening', llo({ port: config.SERVICES.API.PORT }));
      resolve(app);
    });

    server.setTimeout(config.SERVICES.API.TIMEOUT * 1000);
  });

module.exports = API;
