const config = require('../config/index');
const{ MongoMemoryReplSet } = require('mongodb-memory-server');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const setModels = require('../src/models');
setModels(mongoose);

const mongoOptions = {
  dbName: config.DB.DB_NAME,
  retryWrites: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
};

let replSet;

const DB = {

  async connect() {
    replSet = new MongoMemoryReplSet({
      binary: {
        version: '4.4.0'
      },
      instanceOpts: [{
        storageEngine: 'wiredTiger'
      }],
    });

    await replSet.start();
    const uri = replSet.getUri();

    await mongoose.connect(uri, mongoOptions);
    mongoose.set('debug', config.DB.DEBUGGER);
  },

  async drop() {

    /*eslint-disable no-async-promise-executor*/
    return new Promise( async (resolve) => {
      await Promise.all(Object.keys(mongoose.models).map( async (name) => {
        await mongoose.models[name].deleteMany();
      }));

      resolve();
    });

  },

  async disconnect() {

    await mongoose.disconnect();
    await replSet.stop();
    console.log('Mongoose successfully disconnected'); // eslint-disable-line no-console
  },

};

module.exports = DB;
