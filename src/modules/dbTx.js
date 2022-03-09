const config = require('../../config/index');
const logger = require('./logger');
const mongoose = require('mongoose');
const utils = require('../helpers/utils');
const errors = require('../helpers/errors');

/*eslint-disable no-unused-vars*/
const llo = logger.logMeta.bind(null, {service: 'db:tx'});

const dbTx = {

  async transactionOptions() {

    const session = await mongoose.connection.startSession({
      readConcern: {level: 'snapshot'},
      writeConcern: {w: 'majority'}
    });

    return session;

  },

  isErrorConflict(error) {

    return error.message === 'WriteConflict';

  },

  isErrorNotSupported(error) {

    return error.message === 'Current topology does not support sessions';

  },

  /*
 ATTENTION
 Last executed call MUST be a transaction.commit in this callback !
 Otherwise may not detect unattended errors
  */
  async executeTxFn(fn) {

    async function tryFn() {

      const session = await dbTx.transactionOptions();

      session.startTransaction();

      const tOpts = {session};

      try {

        const response = await fn(tOpts);
        return response;

      } catch (error) {

        try {

          await session.abortTransaction();
          session.endSession();

        } catch (errorRollback) {

          logger.warn('unable to rollback transaction - manual review', llo({error: errorRollback}));
        }

        throw error;
      }
    }

    try {

      const response = await tryFn();
      return response;

    } catch (error) {

      return await dbTx.handleTxError(error, tryFn);
    }

  },

  async handleTxError(error, retryFn, i = 0) {

    if(dbTx.isErrorConflict(error) ){

      logger.warn('mongodb concurrent error', llo({ error }));

      errors.assert(i < config.DB.RETRY_CONCURRENT_INTERVAL, 'mongodb_concurrent', { errorMongoDb: error });

      await utils.wait(Math.round(Math.random() * config.DB.RETRY_CONCURRENT_WAIT_TIME) + 100);

      try{

        return await retryFn();

      } catch (error){

        return await dbTx.handleTxError(error, retryFn, ++i);

      }

    } else if (dbTx.isErrorNotSupported(error)) {

      logger.warn('mongodb atomic transaction not supported error', llo({ error }));

      throw error;

    } else {

      throw error;
    }

  },

};

module.exports = dbTx;
