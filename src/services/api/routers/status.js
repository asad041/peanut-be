const Router = require('@koa/router');
const StatusController = require('../controllers/status');

const StatusRouter = {

  async status(ctx) {

    ctx.cacheControl(60 * 1000); // 1 minute

    ctx.body = await StatusController.get();
  },

  router(){

    const router = Router();

    /**
     * @api {get} /ico Get ICO status
     * @apiName status_ico
     * @apiGroup Status
     * @apiDescription Get ICO status
     *
     * @apiSampleRequest /
     *
     */
    router.get('/', StatusRouter.status);

    return router;

  }

};

module.exports = StatusRouter;
