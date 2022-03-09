const path = require('path');
const sinon = require('sinon');
const moment = require('moment');
const request = require('request-promise');
const logger = require(path.join(srcDir, '/modules/logger'));
const Utils = require(path.join(srcDir, '/helpers/utils'));

describe('Helpers: Utils', () => {

  let sandbox = null;

  beforeEach(() => {

    sandbox = sinon.createSandbox();

  });

  afterEach(() => {


    if (this.clock) {
      this.clock.restore();
    }
    sandbox && sandbox.restore();

  });

  it('Should noop', () => {

    expect(Utils.noop()).to.eq(0);

  });

  it('Should wait', (done) => {

    let end = false;

    Utils.wait(500).then(() => {
      end = true;
      return true;
    }).catch(error => console.error(error));

    setTimeout(() => {
      if (end) {
        done('too early');
      }
    }, 300);
    setTimeout(() => {
      if (end) {
        done();
      } else {
        done('too late')
      }
    }, 600);

  });

  it('Should get imes', () => {

    let count = 0;

    Utils.times(5)(() => {
      count++;
    });

    expect(count).to.eq(5);

  });

  it('setImmediateAsync', async () => {

    let rs = false;
    let th = false;

    const error = new Error('er');
    const logerror = sandbox.stub(logger, 'error');

    const fnResolve = async () => {
      await Utils.wait(100);
      rs = true;
    };
    const fnThrow = async () => {
      await Utils.wait(100);
      th = true;
      throw error;
    };

    Utils.setImmediateAsync(fnResolve);
    Utils.setImmediateAsync(fnThrow);

    expect(rs).to.be.false;
    expect(th).to.be.false;

    await Utils.wait(110);

    expect(rs).to.be.true;
    expect(th).to.be.true;

    expect(logerror.args[0][0]).to.eq(error.message);
    expect(logerror.args[0][1].error).to.eq(error);

  });

  it('enum to object', () => {

    const en = ['a', 'b', 'c'];

    const obj = Utils.enumToObject(en);

    expect(Object.keys(obj).length).to.eq(3);
    expect(obj['a']).to.eq('a');
    expect(obj['b']).to.eq('b');
    expect(obj['c']).to.eq('c');

  });

  it('Should generate random 6 digit numbers', async () => {

    const pincode = Utils.sixDigitsRandom();
    expect(typeof pincode).eq('string');
    expect(pincode.length).eq(6);
    expect(new RegExp('^[0-9]*$').test(pincode)).eq(true);

  });

  it('capitalizeFirstLetter', () => {

    const name = 'tom';

    const newName = Utils.capitalizeFirstLetter(name);

    expect(newName).to.eq('Tom');

  });

  it('capitalizeFirstLetter with uppercase', () => {

    const name = 'TOM';

    const newName = Utils.capitalizeFirstLetter(name);

    expect(newName).to.eq('Tom');

  });

  describe('setIntervalAsync', () => {

    it('repeats', async () => {

      const onError = sinon.stub();
      const fn = sinon.stub().resolves(Utils.wait(50));
      const delay = 200;

      const clear = Utils.setIntervalAsync(fn, delay, onError);

      await Utils.wait(100);
      expect(fn.args.length).to.eq(1);

      await Utils.wait(200);
      expect(fn.args.length).to.eq(2);

      await Utils.wait(300);
      expect(fn.args.length).to.eq(3);

      clear();

      await Utils.wait(300);
      expect(fn.args.length).to.eq(3);

    });

    it('stops while working', async () => {

      const onError = sinon.stub();
      const fn = sinon.stub().resolves(Utils.wait(500));
      const delay = 100;

      const clear = Utils.setIntervalAsync(fn, delay, onError);

      await Utils.wait(100);
      expect(fn.args.length).to.eq(1);

      clear();

      await Utils.wait(600);
      expect(fn.args.length).to.eq(1);

    });

    it('clear waits execution end', async () => {

      const onError = sinon.stub();
      const fn = sinon.stub().resolves(Utils.wait(500));
      const delay = 100;

      const clear = Utils.setIntervalAsync(fn, delay, onError);
      await Utils.wait(10);
      expect(fn.args.length).to.eq(1);

      const d = Date.now();

      await clear(true);

      expect(Date.now() - d).to.be.greaterThan(400);

    });

    it('throws', async () => {

      const onError = sinon.stub();
      const e = new Error('pascontent');
      const fn = sinon.stub().resolves(Utils.wait(100));
      const delay = 500;

      const clear = Utils.setIntervalAsync(fn, delay, onError);

      await Utils.wait(200);
      expect(fn.args.length).to.eq(1);

      fn.rejects(e);
      expect(onError.calledOnce).to.be.false;

      await Utils.wait(500);

      expect(fn.args.length).to.eq(2);
      expect(onError.calledOnce).to.be.true;
      expect(onError.args[0][0]).to.eq(e);

      clear();

    });

    it('throws but still continues', async () => {

      const onError = sinon.stub();
      const e = new Error('pascontent');
      const fn = sinon.stub().resolves(Utils.wait(50));
      const delay = 400;

      const clear = Utils.setIntervalAsync(fn, delay, onError);

      await Utils.wait(200);
      expect(fn.args.length).to.eq(1);

      fn.rejects(e);
      expect(onError.calledOnce).to.be.false;

      await Utils.wait(500);

      expect(fn.args.length).to.eq(2);
      expect(onError.calledOnce).to.be.true;
      expect(onError.args[0][0]).to.eq(e);

      await Utils.wait(500);
      expect(fn.args.length).to.eq(3);

      clear();

    });

    it('throws with default error handler', async () => {

      const error = sandbox.stub(logger, 'error');

      const e = new Error('pascontent');
      const fn = sinon.stub().resolves(Utils.wait(100));
      const delay = 500;

      const clear = Utils.setIntervalAsync(fn, delay);

      await Utils.wait(200);
      expect(fn.args.length).to.eq(1);

      fn.rejects(e);
      expect(error.calledOnce).to.be.false;

      await Utils.wait(500);

      clear();

      expect(fn.args.length).to.eq(2);
      expect(error.calledOnce).to.be.true;
      expect(error.args[0][0]).to.eq('pascontent');
      expect(error.args[0][1].error).to.eq(e);

    });
  });

  it('Should rate limit', async () => {


    const stub = sinon.stub().returns(Promise.resolve());
    const limiter = Utils.rateLimit(2, 1000, stub);
    Promise.all([
      limiter(1),
      limiter(2),
      limiter(3),
      limiter(4)
    ]).catch(error => console.error(error));

    expect(stub.callCount).to.eq(2);

    await Utils.wait(1000);

    expect(stub.callCount).to.eq(4);

  });

  describe('chunkPeriod', () => {

    it('Should chunk time without size', () => {

      const start = moment().startOf('minutes');
      const end = start.clone().add('10', 'minutes');

      const chunkDates = Utils.chunkPeriod(start, end);

      expect(chunkDates.length).to.eq(10);

    });

    it('Should chunk time with size', () => {

      const start = moment().startOf('minutes');
      const end = start.clone().add('30', 'minutes');
      const chunkDates = Utils.chunkPeriod(start, end, 'minutes', 10);

      expect(chunkDates.length).to.eq(3);

    });

    it('Should chunk only one', () => {

      const start = moment().startOf('minutes');
      const end = start.clone().add('10', 'minutes');
      const chunkDates = Utils.chunkPeriod(start, end, 'minutes', 10);

      expect(chunkDates.length).to.eq(1);

    });

  });

  it('Should remove empty strings', () => {
    const data = {
      a: 'a',
      b: 'b',
      c: '',
      d: undefined
    };

    const clean = Utils.removeEmptyStrings(data);
    expect(clean).to.have.property('a', 'a');
    expect(clean).to.have.property('b', 'b');
    expect(clean).not.to.have.property('c');
    expect(clean).not.to.have.property('d');

  });

  it('stringNotNull', () => {

    expect(Utils.stringNotNull('')).to.be.false;
    expect(Utils.stringNotNull(null)).to.be.false;
    expect(Utils.stringNotNull('a')).to.be.true;

  });

  it('isTrue', () => {

    expect(Utils.isTrue(true)).to.be.true;
    expect(Utils.isTrue('true')).to.be.true;

    expect(Utils.isTrue('fezf')).to.be.false;
    expect(Utils.isTrue('false')).to.be.false;
    expect(Utils.isTrue('fdsqgqdsg')).to.be.false;
    expect(Utils.isTrue(false)).to.be.false;

  });

  it('sortByDate', () => {

    const arr = [
      {id: 0, p: moment('2017-11-10T22:44:53Z').format()},
      {id: 1, p: moment('2017-11-01T22:44:53Z').format()},
      {id: 2, p: moment('2017-11-03T22:44:53Z').format()},
      {id: 3, p: moment('2017-11-12T22:44:53Z').format()},
      {id: 4, p: moment('2017-11-04T22:44:53Z').format()},
    ];

    const asc = arr.sort(Utils.sortByDate('p', 'asc'));

    expect(asc[0].id).to.eq(1);
    expect(asc[1].id).to.eq(2);
    expect(asc[2].id).to.eq(4);
    expect(asc[3].id).to.eq(0);
    expect(asc[4].id).to.eq(3);

    const desc = arr.sort(Utils.sortByDate('p', 'desc'));
    expect(desc[0].id).to.eq(3);
    expect(desc[1].id).to.eq(0);
    expect(desc[2].id).to.eq(4);
    expect(desc[3].id).to.eq(2);
    expect(desc[4].id).to.eq(1);

  });

  it('configParser', () => {

    const configSource = {
      string: 'coucou',
      array: 'coucou,caca',
      boolt: 'true',
      boolf: 'false',
      boolu: 'f',
      integer: 12,
      decimal: 12.12,
    };
    expect(Utils.configParser(configSource, 'string', 'string')).to.eq('coucou');
    expect(Utils.configParser(configSource, 'string', 'string', 'def')).to.eq('coucou');
    expect(Utils.configParser(configSource, 'string', 'array')).to.eq('coucou,caca');
    expect(Utils.configParser(configSource, 'string', 'unknown')).to.eq('');
    expect(Utils.configParser(configSource, 'string', 'unknown', 'def')).to.eq('def');

    expect(Utils.configParser(configSource, 'array', 'array')).to.deep.eq(['coucou', 'caca']);
    expect(Utils.configParser(configSource, 'array', 'array', ['def'])).to.deep.eq(['coucou', 'caca']);
    expect(Utils.configParser(configSource, 'array', 'string')).to.deep.eq(['coucou']);
    expect(Utils.configParser(configSource, 'array', 'unknown')).to.deep.eq([]);
    expect(Utils.configParser(configSource, 'array', 'unknown', ['def'])).to.deep.eq(['def']);

    expect(Utils.configParser(configSource, 'bool', 'boolt')).to.be.true;
    expect(Utils.configParser(configSource, 'bool', 'boolt', false)).to.be.true;
    expect(Utils.configParser(configSource, 'bool', 'boolf')).to.be.false;
    expect(Utils.configParser(configSource, 'bool', 'boolu')).to.be.false;
    expect(Utils.configParser(configSource, 'bool', 'boolunnn')).to.be.false;
    expect(Utils.configParser(configSource, 'bool', 'boolunnn', true)).to.be.true;

    expect(Utils.configParser(configSource, 'number', 'integer')).to.eq(12);
    expect(Utils.configParser(configSource, 'number', 'decimal')).to.eq(12.12);
    expect(Utils.configParser(configSource, 'number', 'unkn')).to.eq(0);
    expect(Utils.configParser(configSource, 'number', 'unkn', 2)).to.eq(2);

    expect(() => Utils.configParser(configSource, 'unk', 'string')).to.throw();

  });

  it('sanitiseString: should sanitise the string', async () => {
    const specialChars = '!#$%?*&';

    const result = Utils.sanitiseString(specialChars);

    expect(result).to.have.lengthOf(0);
  });

  it('sanitiseString: should sanitise the string and escape @, + and numbers in the email', () => {
    const email = 'test+21@email.com?!';

    const result = Utils.sanitiseString(email);

    expect(result).to.be.equal('test+21@email.com');
  });

  it('asyncForEach', async () => {

    let i = 0;
    let done = false;
    const arr = [0, 1, 2, 3];

    async function fn(obj, index, array) {
      expect(obj).to.eq(i);
      expect(index).to.eq(i);
      expect(array).to.eq(arr);
      i++;
      if (i === 3) done = true;
    }

    await Utils.asyncForEach(arr, fn);

    expect(done).to.be.true;

  });

  it('Should asyncForEach and break on false', async () => {

    const stubFn = sandbox.stub().callsFake(async (item, i) => {

      if (i === 1) {

        return false;

      }

      return true;

    });

    await Utils.asyncForEach([0, 1, 2, 3], stubFn, true);
    expect(stubFn.callCount).to.eq(2);

  });

  it('asyncParralel', async () => {

    const tasks = [
      async () => {
        await Utils.wait(100);
        return 1;
      },
      async () => {
        await Utils.wait(100);
        return 2;
      },
      async () => {
        await Utils.wait(100);
        throw new Error('1');
      },
      async () => {
        await Utils.wait(100);
        throw new Error('2');
      },
    ];

    const onError = sandbox.stub();
    const t1 = Date.now();

    const res = await Utils.asyncParallel(tasks, onError);

    const time = Date.now() - t1;

    expect(time > 100).to.be.true;

    expect(res[0]).to.eq(1);
    expect(res[1]).to.eq(2);
    expect(onError.args[0][0].message).to.eq('1');
    expect(onError.args[1][0].message).to.eq('2');

  });

  it('asyncMap', async () => {

    const array = [
      100,
      200,
      10001,
      10002,
    ];

    async function fn(time) {
      if (time > 1000)
        throw new Error(time.toString());
      await Utils.wait(100);
      return time;
    }

    const onError = sandbox.stub();
    const t1 = Date.now();

    const res = await Utils.asyncMap(array, fn, onError);

    const time = Date.now() - t1;

    expect(time > 99).to.be.true;
    expect(res[0]).to.eq(100);
    expect(res[1]).to.eq(200);
    expect(onError.args[0][0].message).to.eq('10001');
    expect(onError.args[1][0].message).to.eq('10002');

  });

  it('request', () => {

    expect(Utils.request).to.eq(request);

  });

  it('stripeArrayParams', () => {

    expect(Utils.stripeArrayParams().length).to.eq(0);
    expect(Utils.stripeArrayParams(1).toString()).to.eq(['1'].toString());
    expect(Utils.stripeArrayParams('1,2,3,4').toString()).to.eq(['1', '2', '3', '4'].toString());

  });

  it('isEmptyObject', () => {

    const bool = Utils.isEmptyObject({});
    expect(bool).to.eq(true);

  });

  it('isEmptyObject not empty', () => {

    const bool = Utils.isEmptyObject({a: 1});
    expect(bool).to.eq(false);

  });

  it('parseMobilePrefix', async () => {

    const mobile = '+39000';
    const newMobile = Utils.parseMobilePrefix(mobile);
    expect(newMobile).to.eq(mobile);

    const mobile1 = '2387234';
    expect(Utils.parseMobilePrefix(mobile1)).to.eq(`+39${mobile1}`);

    const mobile3 = '0039393245885133';
    expect(Utils.parseMobilePrefix(mobile3)).to.eq(`${mobile3}`);

    const number = '+15005550000';
    expect(Utils.parseMobilePrefix(number)).to.eq(number);

    const number1 = '5005550000';
    expect(Utils.parseMobilePrefix(number1)).to.eq(`+39${number1}`);

    const number2 = '00445005550000';
    expect(Utils.parseMobilePrefix(number2)).to.eq(number2);

    const number3 = '00445005 550000';
    expect(Utils.parseMobilePrefix(number3)).to.eq('00445005550000');

    const number4 = '+15005 550000';
    expect(Utils.parseMobilePrefix(number4)).to.eq('+15005550000');

    const number5 = '3913691672';
    expect(Utils.parseMobilePrefix(number5)).to.eq('+393913691672');

  });

  it('validEmail', () => {

    const result = Utils.validEmail('x@me.com');
    expect(result).to.be.true;

    const result1 = Utils.validEmail('xme.com');
    expect(result1).to.be.false;

  });

  it('Should get validUrl', async () => {

    let uri = '';

    expect(Utils.validUrl(uri)).to.eq(false);

    uri = 'https://hooks.stripe.com/redirect/authenticate/src_1HzteeAcHwum8qP3dQIefmOg?client_secret=src_client_secret_N2Z4WX8TVqYvhcPdAfCCzBkL';

    expect(Utils.validUrl(uri)).to.eq(true);


  });

})
;
