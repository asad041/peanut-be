const superagent = require('superagent');

const request = {
  get: (url) => { return superagent.get(url); },
};

module.exports = request;
