const DB = require('./db');
const logger = require('../modules/logger');
const Utils = require('../helpers/utils');

const llo = logger.logMeta.bind(null, { service: 'connection' });

const Connections = {
  openedConnections: [],

  open(needConnections) {

    return Utils.asyncForEach(needConnections, async connection => {

      try {

        if(!connection || Connections.openedConnections.find(c => c === connection)) return Promise.resolve();

        Connections.openedConnections.push(connection);

        switch(connection) {
          case 'mongoose': {
            const db = await DB.connect();
            return db;
          }
          default: {
            Connections.openedConnections.pop();
            return Promise.reject(new Error('Unknown service to connect to') );
          }
        }

      } catch(err){

        err.connection = connection;
        throw err;
      }

    })
      .then(() => {
        logger.verbose('Connections open', llo({}));
        return true;
      })
      .catch(error => {
        Connections.openedConnections.pop();
        logger.warn('Unable to open connections', { error });
        throw error;
      });

  },

  close() {

    return Utils.asyncForEach(Connections.openedConnections, async connection => {
      switch(connection) {
        case 'mongoose': {
          return DB.disconnect();
        }
        default: {
          return Promise.reject(new Error('Unknown service to disconnect from') );
        }
      }
    })
      .then(() => {
        Connections.openedConnections = [];
        logger.verbose('Connections closed', llo({}));
        logger.purge();
        return Utils.wait(500);
      })
      .catch(error => {
        logger.error('Unable to close connections', llo({ error }));
        throw error;
      });

  },

};

module.exports = Connections;
