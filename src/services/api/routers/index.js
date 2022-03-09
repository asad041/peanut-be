const Router = require('@koa/router');
const StatusRouter = require('./status');
const CoinRouter = require('./coin');

const MainRouter = {
  router() {
    const statusRouter = StatusRouter.router();
    const coinRouter = CoinRouter.router();

    const mainRouter = Router();

    mainRouter.use(statusRouter.routes(), statusRouter.allowedMethods());
    mainRouter.use('/coin', coinRouter.routes(), coinRouter.allowedMethods());

    return mainRouter;
  },
};

module.exports = MainRouter;
