require('dotenv').config();

const { assignIn } = require('lodash');
const commonConfig = require('./common');

const CONFIG = {
  updateConfig(sourceConfig) {
    const newConfig = commonConfig.getConfigObject(sourceConfig);
    assignIn(CONFIG, newConfig);
  }
};

CONFIG.updateConfig(process.env);

module.exports = CONFIG;
