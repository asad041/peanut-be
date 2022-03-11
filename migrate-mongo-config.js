const configuration = require('./config/index');

const config = {
  mongodb: {
    url: configuration.DB.URI,
    databaseName: configuration.DB.DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js',

  // Allows you to call the up and down function through it with your arguments.
  // It's recommended to add your own migration-sample.js file to the migrations directory if you change the arguments.
  // customRunnerPath: "./script.js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,
};

// Return the config as a promise
module.exports = config;
