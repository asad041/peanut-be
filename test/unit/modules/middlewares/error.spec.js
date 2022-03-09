const path = require('path');
const sinon = require('sinon');

const ErrorMiddleware = require(path.join(srcDir, '/modules/middlewares/error') )();

describe('Modules Middleware: Error', () => {
  let sandbox = null;


  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('run', async () => {

    const next = sinon.stub();
    const ctx = {};

    await ErrorMiddleware(ctx, next);

    expect(next.calledWith()).to.be.true;

  });

  it('catch', async () => {

    const next = sinon.stub().rejects(new Error('coucou'));
    const ctx = { requestInfo : {} };

    await ErrorMiddleware(ctx, next);

    expect(next.calledWith()).to.be.true;
    expect(ctx.status).to.eq(500);
    expect(ctx.body).to.deep.eq({
      code: 'unknown_error',
      description: 'Internal server error',
    });
  });

  it('catch with custom', async () => {

    const err = new Error('coucou');
    err.exposeCustom_ = true;
    err.status = 100;
    err.description = 'desc';
    err.exposeMeta = 'meta';
    const next = sinon.stub().rejects(err);
    const ctx = { requestInfo : {} };

    await ErrorMiddleware(ctx, next);

    expect(next.calledWith()).to.be.true;

    expect(ctx.status).to.eq(100);
    expect(ctx.body).to.deep.eq({
      code: 'coucou',
      description: 'desc',
      meta: 'meta',
    });

  });

});
