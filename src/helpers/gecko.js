const request = require('./request');
const config = require('../../config/index');
const errors = require('./errors');

module.exports = {
  getCoinByName:  async (coinName) => { 
    const apiEnd = config.URL.GECKO_API_URL + '/coins/' + coinName;
    try {
      const res = await request.get(apiEnd);
      return res.body?.market_data?.current_price?.usd || -1;
    } catch (e) {
      errors.assertExposable(null, 'unknown_coin_code');
    }
  },

  // TODO: other gecko platform apis
};

