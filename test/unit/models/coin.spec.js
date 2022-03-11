const sinon = require('sinon');
const CoinModel = mongoose.model('coin');

describe('Model:coin', () => {

  let sandbox = null;

  beforeEach(async () => {

    sandbox = sinon.createSandbox();

    const rawCoin = {
      name: 'Bitcoin',
      code: 'BTC',
    };

    this.coin = await CoinModel.create(rawCoin);

  });

  afterEach(async () => {

    sandbox && sandbox.restore();
  });

  it('Should create', async () => {

    expect(this.coin.name).to.eq('bitcoin');
    expect(this.coin.code).to.eq('BTC');

  });

  it('Should find by coinCode', async () => {

    const coin = await CoinModel.findByCoinCode('BTC');
    expect(coin.name).to.eq('bitcoin');
    expect(coin.code).to.eq('BTC');

  });

  it('Should update', async () => {

    await this.coin.update({
      code: 'ETH'
    });

    await this.coin.reload();

    expect(this.coin.code).to.eq('ETH');

  });

  it('Should filterKeys', async () => {

    const coin = this.coin.filterKeys();
    expect(Object.keys(coin).length).to.eq(6);
    expect(coin._id).to.exist;
    expect(coin.code).to.exist;
    expect(coin.name).to.exist;
    expect(coin.price).to.exist;
    expect(coin.isActive).to.exist;
    expect(coin.fetchedTime).to.exist;

  });

});

