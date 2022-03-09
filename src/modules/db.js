const config = require('../../config/index');
const logger = require('./logger');
const mongoose = require('mongoose');
const promiseRetry = require('promise-retry');
require('../models')(mongoose);

const llo = logger.logMeta.bind(null, { service: 'db' });

const mongoOptions = {
  dbName: config.DB.DB_NAME,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  // reconnectTries: 60, // Retry up to 30 times
  // reconnectInterval: 1000, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

const promiseRetryOptions = {
  retries: 60,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 5000
};

const DB = {

  async connect() {

    mongoose.connection.on('error', error => {
      logger.verbose('MongoDB connection error', llo({error}));
    });

    mongoose.connection.on('connected', async () => {

      await Promise.all(Object.keys(mongoose.models).map( async (name) => {
        await mongoose.models[name].syncIndexes();
      }));

      logger.info('MongoDB connected', llo({
        env: config.NODE_ENV
      }));
    });

    mongoose.set('debug', config.DB.DEBUGGER);


    return promiseRetry((retry, number) => {

      logger.verbose('MongoDB try connecting', llo({
        retry: number
      }));

      return mongoose.connect(config.DB.URI, mongoOptions).catch(retry);

    }, promiseRetryOptions);

  },

  async disconnect() {

    await mongoose.disconnect();
    logger.verbose('MongoDB disconnect', llo({}));
  },

};

module.exports = DB;
