const request = require('./request');
const config = require('../../config/index');
const errors = require('./errors');

module.exports = {
  extractedPrice: (data, currency = 'usd') => {
    if (data.market_data && data.market_data.current_price) return data.market_data.current_price[currency];
    return -1;
  },

  getCoinByName:  async (coinName) => { 
    const apiEnd = config.URL.GECKO_API_URL + '/coins/' + coinName;
    try {
      const res = await request.get(apiEnd);
      return this.extractedPrice(res.body);
    } catch (e) {
      errors.assertExposable(null, 'unknown_coin_code');
    }
  },

  // TODO: other gecko platform apis
};

