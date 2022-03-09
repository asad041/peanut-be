const path = require('path');
const sinon = require('sinon');
const moment = require('moment');
const StatusCtrl = require(path.join(srcDir, '/services/api/controllers/status'));
const config = require(path.join(srcDir, '../config'));

describe('Controller:status', () => {

  let sandbox = null;

  beforeEach(async () => {

    sandbox = sinon.createSandbox();

  });

  afterEach(() => {

    sandbox && sandbox.restore();

  });

  describe('get status', () => {

    it('Should get status ', async () => {

      const status = await StatusCtrl.get();

      expect(status.status).to.eq('healthy');
      expect(status.appName).to.eq(config.APP_NAME);
      expect(status.environment).to.eq(config.ENVIRONMENT);
      expect(moment(status.time).isValid()).to.be.true;

    });

  });

});

