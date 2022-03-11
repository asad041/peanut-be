const async = require('async');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const Decimal = require('decimal.js');
const request = require('request-promise');
const {URL} = require('url');

const Utils = {
  noop: () => 0,

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  times: (n) => (f) => {
    let iter = (i) => {
      if (i === n) return;
      f(i);
      iter(i + 1);
    };
    return iter(0);
  },

  isTrue(b) {
    return b === true || b === 'true';
  },

  /* istanbul ignore next */
  defaultError(error) {
    console.error(error); // eslint-disable-line no-console
  },

  capitalizeFirstLetter(string) {
    const firstLowercase = string.toLowerCase();
    return firstLowercase.charAt(0).toUpperCase() + firstLowercase.slice(1);
  },

  enumToObject(en) {
    return en.reduce(
      (object, key) => Object.assign(object, { [key]: key }),
      {}
    );
  },

  setImmediateAsync(fn, onError) {
    fn().catch(onError || Utils.defaultError);
  },

  setIntervalAsync(fn, delay, onError) {
    let timeout = null;
    let running = true;
    let endPromise = Promise.resolve();

    const errorHandler = onError || Utils.defaultError;

    async function launchAndWait() {
      let resolveNoop = Utils.noop;

      try {
        endPromise = new Promise((resolve) => (resolveNoop = resolve)).catch(
          Utils.noop
        );

        await fn();
        resolveNoop();
      } catch (error) {
        errorHandler(error);
        resolveNoop();
      } finally {
        if (running) {
          timeout = setTimeout(launchAndWait, delay);
        }
      }
    }

    launchAndWait(fn, delay).catch(errorHandler);

    return (wait = false) => {
      running = false;
      clearTimeout(timeout);
      if (wait) {
        return endPromise;
      } else {
        return null;
      }
    };
  },

  validEmail(email) {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  },

  rateLimit(parallel, time, fn) {
    const stack = [];

    let currentRunning = 0;

    function callNext() {
      currentRunning++;

      setTimeout(() => {
        currentRunning--;

        if (currentRunning < parallel && stack.length > 0) {
          callNext();
        }
      }, time);

      const { ctx, args, resolve, reject } = stack.shift();
      fn.apply(ctx, args).then(resolve).catch(reject);
    }

    return function limiter(...args) {
      return new Promise((resolve, reject) => {
        stack.push({ ctx: this, args, resolve, reject });

        if (currentRunning < parallel) {
          callNext();
        }
      });
    };
  },

  chunkPeriod(start, end, unit = 'minutes', step = 1) {
    const range = moment.range(start, end);

    const chunk = Array.from(range.by(unit, { step: step }));

    return chunk.reduce((acc, date, i) => {
      if (i !== chunk.length - 1) {
        acc.push({ start: date, end: chunk[i + 1] });
      }

      return acc;
    }, []);
  },

  timeDifference(start, end, unit = 'minutes') {
    if (!start) start = moment();

    return start.diff(moment(end), unit);
  },

  removeEmptyStrings(data) {
    return Object.keys(data).reduce((acc, prop) => {
      if (data[prop] !== '' && data[prop] !== undefined) {
        return Object.assign(acc, { [prop]: data[prop] });
      }
      return acc;
    }, {});
  },

  sanitiseString(str) {
    return str.replace(/[^\w\s(@.+)]/g, '');
  },

  stringNotNull(value) {
    return typeof value === 'string' && value.length > 0;
  },

  sortByDate(prop, order = 'asc') {
    let reverse = null;
    if (order === 'asc') {
      reverse = 1;
    } else if (order === 'desc') {
      reverse = -1;
    } else {
      /* istanbul ignore next */
      throw new Error('invalid order');
    }
    return (a, b) => reverse * (moment.utc(a[prop]) - moment.utc(b[prop]));
  },

  configParser(configSource = process.env, type, key, defaultValue) {
    const val = configSource[key];

    function def(v) {
      return defaultValue === undefined ? v : defaultValue;
    }

    switch (type) {
      case 'string': {
        return val || def('');
      }

      case 'array': {
        return val ? val.split(',') : def([]);
      }

      case 'number': {
        if (!val) return def(0);

        const djs = Decimal(val);
        return djs.toNumber();
      }

      case 'bool': {
        return val ? val === 'true' : def(false);
      }

      default: {
        throw new Error('Unknwon variable type');
      }
    }
  },

  async asyncForEach(array, fn, breakOnFalse = false) {
    for (let index = 0; index < array.length; index++) {
      const res = await fn(array[index], index, array);

      if (breakOnFalse && res === false) {
        break;
      }
    }
  },

  asyncParallel: (tasks, onError) =>
    new Promise((resolve) => {
      const wrappedTasks = async.reflectAll(tasks);

      function callback(err, results) {
        const successResults = results
          .filter((res) => !!res.value)
          .map((res) => res.value);
        const errorResults = results
          .filter((res) => !!res.error)
          .map((res) => res.error);

        errorResults.forEach((error) => onError && onError(error));
        resolve(successResults);
      }

      async.parallel(wrappedTasks, callback);
    }),

  asyncMap: (array, fn, onError) => {
    const tasks = array.map((element) => async () => fn(element));

    return Utils.asyncParallel(tasks, onError);
  },

  stripeArrayParams: (value) => {
    if (!value || value == '') {
      return [];
    }

    const params = value.toString();

    if (params.indexOf(',') !== -1) {
      return params.split(',') || [];
    } else {
      return [params];
    }
  },

  JSONStringifyCircular(object) {
    const cache = [];
    const str = JSON.stringify(
      object,
      function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      },
      2
    );

    return str;
  },

  parseMobilePrefix(mobile) {
    const stripeNumber = mobile.replace(' ', '');

    if (
      stripeNumber &&
      stripeNumber.charAt(0) &&
      stripeNumber.charAt(1) &&
      stripeNumber.charAt(0).toString() === '0' &&
      stripeNumber.charAt(1).toString() === '0'
    ) {
      return `${stripeNumber}`;
    }

    if (stripeNumber && stripeNumber.charAt(0) !== '+') {
      return `+39${stripeNumber}`;
    }

    return stripeNumber;
  },

  isEmptyObject(object) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        return false;
      }
    }

    return true;
  },

  validDate(value) {
    /* istanbul ignore next */
    if (!value) {
      return false;
    }

    return (
      Object.prototype.toString.call(value) === '[object Date]' ||
      moment.isMoment(value)
    );
  },

  validUrl(uri) {
    try {
      new URL(uri);

      return true;
    } catch (_) {
      return false;
    }
  },

  stringHasValue(value) {
    /* istanbul ignore next */
    if (!value) {
      return false;
    }

    return (
      Object.prototype.toString.call(value) === '[object String]' &&
      value.length > 0
    );
  },

  objectHasValue(value) {
    return value && value === Object(value) && Object.keys(value).length > 0;
  },

  arrayHasValue(array) {
    /* istanbul ignore next */
    if (!array) {
      return false;
    }

    return array && Array.isArray(array) && array.length > 0;
  },

  sixDigitsRandom() {
    return Math.floor(100000 + Math.random() * 900000).toFixed();
  },

  isNotEmptyDeep(value) {
    /* istanbul ignore next */
    if (!value) {
      return false;
    }

    if (this.validDate(value)) {
      return true;
    }

    if (this.stringHasValue(value)) {
      return true;
    }

    /* istanbul ignore next */
    if (this.arrayHasValue(value)) {
      return true;
    }

    return this.objectHasValue(value);
  },

  request,
};

module.exports = Utils;
