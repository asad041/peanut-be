const errors = require('../../../helpers/errors');
const gecko = require('../../../helpers/gecko');
const logger = require('../../../modules/logger');
const mongoose = require('mongoose');
const { timeDifference } = require('../../../helpers/utils');

const CoinModel = mongoose.model('coin');

/*eslint-disable no-unused-vars*/
const llo = logger.logMeta.bind(null, { service: 'api:controllers:coin' });

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await CoinModel.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    const lastTimeFetched = timeDifference(null, coin.fetchedTime);

    if (coin.price === 0 || lastTimeFetched > 59) {
      const fetchedPrice = await gecko.getCoinByName(coin.name);
      if (fetchedPrice > -1) {
        await coin.update({ price: fetchedPrice, fetchedTime: Date.now() });
      }
    }

    return coin.filterKeys();
  },

  async createCoin(coinCode, coinName) {
    const exisitingCoin = await CoinModel.findByCoinCode(coinCode);

    if (exisitingCoin) {
      errors.assertExposable(null, 'already_coin_exists');
    }

    const coin = await CoinModel.create({ code: coinCode, name: coinName });

    return coin.filterKeys();
  },
};

module.exports = CoinController;
