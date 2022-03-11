const path = require('path');
const sinon = require('sinon');
const moment = require('moment');
const CoinCtrl = require(path.join(srcDir, '/services/api/controllers/coin'));
const GeckoHelper = require(path.join(srcDir, '/helpers/gecko'));
// const config = require(path.join(srcDir, '../config'));
const CoinModel = mongoose.model('coin');

describe('Controller:coin', () => {
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    this.rawCoin = await CoinModel.create({
      code: 'BTC',
      name: 'bitcoin',
      price: 0,
      fetchedTime: moment(),
    });

  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('create coin', () => {
    it('Should create and get coin', async () => {
      const dummyCoin = {
        code: 'xyz',
        name: 'raw-coin',
        price: 0,
        isActive: true,
      };
      const rawCoin = {
        ...dummyCoin,
        filterKeys: () => dummyCoin,
      };

      const stubFindByCoinCode = sandbox.stub(CoinModel, 'findByCoinCode').resolves(null);
      const stubCreate = sandbox.stub(CoinModel, 'create').resolves(rawCoin);

      const coin = await CoinCtrl.createCoin(rawCoin.code, rawCoin.name);

      expect(coin.code).to.eq(rawCoin.code);
      expect(stubFindByCoinCode.calledOnce).to.be.true;
      expect(stubFindByCoinCode.calledWith(rawCoin.code)).to.be.true;

      expect(stubCreate.calledOnce).to.be.true;
      expect(stubCreate.args[0][0].code).to.eq(rawCoin.code);
      expect(stubCreate.args[0][0].name).to.eq(rawCoin.name);
    });

    it('Should not create coin if coin already exist', async () => {

      const rawCoin = {
        code: 'xyz',
        name: 'raw-coin',
        price: 0,
        isActive: true,
        filterKeys: () => (rawCoin),
      };

      sandbox.stub(CoinModel, 'findByCoinCode').resolves(rawCoin);

      await expect(CoinCtrl.createCoin(rawCoin)).to.be.rejectedWith(Error, 'already_coin_exists');

    });

    // it('Should throw error', async () => {});
  });

  describe('get coin', () => {
    it('Should get coin by code ', async () => {
      sandbox.stub(CoinModel, 'findByCoinCode').resolves(this.rawCoin);
      const stubGeckoAPI = sandbox.stub(GeckoHelper, 'getCoinByName').resolves(null);

      const coin = await CoinCtrl.getCoinByCode(this.rawCoin.code);

      expect(stubGeckoAPI.calledOnce).to.be.true;

      expect(coin.name).to.eq(this.rawCoin.name);
      expect(coin.code).to.eq(this.rawCoin.code);
      expect(moment(coin.fetchedTime).isValid()).to.be.true;
      expect(coin.isActive).to.be.true;
    });

    it('Should throw error if incorrect code', async () => {
      await expect(CoinCtrl.getCoinByCode('ABC')).rejectedWith(Error, 'unknown_coin_code');
    });

  });
});
