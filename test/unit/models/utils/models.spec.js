const path = require('path');
const sinon = require('sinon');
const moment = require('moment');
const ModelsUtils = require(path.join(srcDir, '/models/utils/models') );

describe('Model:utils', () => {

  let sandbox = null;

  beforeEach( async () => {

    sandbox = sinon.createSandbox();

  });

  afterEach( () => {

    sandbox && sandbox.restore();

  });

  it('Should filterByDate', async () => {

    const fromDate = moment().toDate();
    const toDate = moment().toDate();

    const params = await ModelsUtils.filterByDate({fromDate, toDate}, 'createdAt');

    expect(moment(params.createdAt['$gte']).isSame(moment(fromDate).startOf('day').toDate())).to.be.true;
    expect(moment(params.createdAt['$lte']).isSame(moment(toDate).endOf('day').toDate())).to.be.true;

    const params2 = await ModelsUtils.filterByDate({fromDate}, 'createdAt');

    expect(moment(params2.createdAt['$gte']).isSame(moment(fromDate).startOf('day').toDate())).to.be.true;
    expect(params2.createdAt['$lte']).to.not.exist;

    const params3 = await ModelsUtils.filterByDate({toDate}, 'createdAt');

    expect(params3.createdAt['$gte']).to.not.exist;
    expect(moment(params3.createdAt['$lte']).isSame(moment(toDate).endOf('day').toDate())).to.be.true;

  });

});
