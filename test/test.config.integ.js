const LocalConnections = require('./dbMock');
// const Connections = require('./connections');
// const DB = require('./dbMock');

before(async () => {
  await LocalConnections.connect();
  // await Connections.open(['mongoose']);
});

beforeEach(async () => {

  await LocalConnections.drop();

});

afterEach( () => {

});

after(async () => {

  await LocalConnections.disconnect();
  // await Connections.close();

});
