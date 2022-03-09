
const address = {};

if (process.env.ENVIRONMENT === 'development') {

  address.API_URL = 'https://test.peanuthub.games';
  address.SITE_URL = 'https://peanuthub.games';

} else {

  address.API_URL = 'http://localhost:3000';
  address.SITE_URL = 'http://localhost:4200';

}

module.exports = address;
