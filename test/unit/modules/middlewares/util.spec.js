const path = require('path');
const sinon = require('sinon');

const UtilMiddleware = require(path.join(srcDir, '/modules/middlewares/util'));

describe('Middleware: utils', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('noop', async () => {
    const next = sinon.stub().resolves('next1');
    const ctx = {};

    const res = await UtilMiddleware.noop(ctx, next);

    expect(res).to.eq('next1');
    expect(next.calledOnce).to.be.true;
  });
});
