const path = require('path');
const sinon = require('sinon');
const Router = require('@koa/router');
const CoinRouter = require(path.join(srcDir, '/services/api/routers/coin'));
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));

describe('Router: Coin', () => {

  let sandbox = null;

  beforeEach(async () => {

    sandbox = sinon.createSandbox();
    this.get = sandbox.stub(Router.prototype, 'get');
    this.put = sandbox.stub(Router.prototype, 'put');

  });

  afterEach(() => {

    sandbox && sandbox.restore();

  });

  it('Should get router', async () => {

    const router = await CoinRouter.router();

    expect(router instanceof Router).to.be.true;

    expect(router.get.calledWith('/:coinCode', CoinRouter.getCoinByCode)).to.be.true;
    expect(router.put.calledWith('/createCoin', CoinRouter.createCoin)).to.be.true;

  });

  it('Should get coin', async () => {

    const ctx = {
      params: {
        coinCode: 'BTC',
      }
    };

    const stubCtrl = sandbox.stub(CoinController, 'getCoinByCode').resolves(true);

    await CoinRouter.getCoinByCode(ctx);

    expect(stubCtrl.calledOnce).to.be.true;
    expect(stubCtrl.calledWith('BTC')).to.be.true;
    expect(ctx.body).to.be.true;

  });
  
  it('Should create coin', async () => {

    const ctx = {
      request: { 
        body: {
          coinCode: 'BTC',
          coinName: 'Bitcoin'
        }
      }
    };

    const stubCtrl = sandbox.stub(CoinController, 'createCoin').resolves(true);

    await CoinRouter.createCoin(ctx);

    expect(stubCtrl.calledOnce).to.be.true;
    expect(stubCtrl.calledWith()).to.be.true;
    expect(ctx.body).to.be.true;

  });

});
