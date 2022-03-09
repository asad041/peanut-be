const path = require('path');
const sinon = require('sinon');
const koa = require('koa');
const supertest = require('supertest');
const config = require(path.join(srcDir, '../config'));
const MainMiddleware = require(path.join(srcDir, '/modules/middlewares'));
const mainRouters = require(path.join(srcDir, '/services/api/routers'));

describe('Middleware: Main', () => {
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.serviceName = 'api-test';

  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  // TODO test the rest

  it('Should install main middleware', async () => {

    const app = new koa();
    app.use(MainMiddleware(this.serviceName, mainRouters.router()));

  });

  it('Should allow all origins', async () => {

    config.SERVICES.API.CORS = [];
    const app = new koa();
    app.use(MainMiddleware(this.serviceName, mainRouters.router()));

    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/').set('Origin', 'google.com');

    expect(res.headers['vary']).to.eq('Origin');
    expect(res.headers['access-control-allow-origin']).to.eq('google.com');

    server.close();

  });

  it('Should allow one origin', async () => {

    config.SERVICES.API.CORS = ['wallet.amon.tech'];
    const app = new koa();
    app.use(MainMiddleware(this.serviceName, mainRouters.router()));

    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/').set('Origin', 'google.com');

    expect(res.body).to.deep.eq({
      code: 'invalid_origin',
      description: 'Origin not allowed'
    });

    const res1 = await request.get('/').set('Origin', 'wallet.amon.tech');
    expect(res1.headers['vary']).to.eq('Origin');
    expect(res1.headers['access-control-allow-origin']).to.eq('wallet.amon.tech');

    server.close();

  });

  it('Should allow multiple origins', async () => {

    config.SERVICES.API.CORS = ['wallet.amon.tech', 'amon.tech'];
    const app = new koa();
    app.use(MainMiddleware(this.serviceName, mainRouters.router()));

    const server = app.listen();
    const request = supertest(server);

    const res = await request.get('/').set('Origin', 'google.com');

    expect(res.body).to.deep.eq({
      code: 'invalid_origin',
      description: 'Origin not allowed'
    });

    const res1 = await request.get('/').set('Origin', 'wallet.amon.tech');
    expect(res1.headers['vary']).to.eq('Origin');
    expect(res1.headers['access-control-allow-origin']).to.eq('wallet.amon.tech');

    const res2 = await request.get('/').set('Origin', 'amon.tech');
    expect(res2.headers['vary']).to.eq('Origin');
    expect(res2.headers['access-control-allow-origin']).to.eq('amon.tech');

    server.close();

  });

});
