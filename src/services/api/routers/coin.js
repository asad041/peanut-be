const Joi = require('@hapi/joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  schemaCreateCoin: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
    coinName: Joi.string().min(3).lowercase().max(20),
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(
      CoinRouter.schemaGetByCoinCode,
      params
    );

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },

  async createCoin(ctx) {
    const params = {
      coinCode: ctx.request.body.coinCode,
      coinName: ctx.request.body.coinName,
    };

    const formattedParams = await validateParams(
      CoinRouter.schemaCreateCoin,
      params
    );

    ctx.body = await CoinController.createCoin(
      formattedParams.coinCode,
      formattedParams.coinName
    );
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Status
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);

    /**
     * @api {put} / create coin
     * @apiName createCoin
     * @apiGroup Status
     * @apiDescription Create coin
     *
     * @apiSampleRequest /
     *
     */
    router.put('/createCoin', CoinRouter.createCoin);

    return router;
  },
};

module.exports = CoinRouter;
