const { now } = require('lodash');

module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db
      .collection('coin')
      .updateMany({}, { $set: { price: 0, fetchedTime: now(), isActive: true } });
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db
      .collection('coin')
      .updateMany({}, { $unset: { price: null, fetchedTime: null, isActive: true } });
  },
};
