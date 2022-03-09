const errors = require('../../../helpers/errors');
const logger = require('../../../modules/logger');
const mongoose = require('mongoose');
const CoinModel = mongoose.model('coin');

/*eslint-disable no-unused-vars*/
const llo = logger.logMeta.bind(null, {service: 'api:controllers:coin'});

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await CoinModel.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    return coin.filterKeys();
  },
};

module.exports = CoinController;

