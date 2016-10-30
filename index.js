/* @flow */

var fs           = require('fs');
var EventEmitter = require('events').EventEmitter;
var helpers      = require('./helpers');

var rootDir = exports.rootDir = process.cwd() + '/';
var dependencies = exports.dependencies = {};
var event = exports.event = new EventEmitter();

module.exports = function(callback) {
  fs.readFile(rootDir + '/package.json', function(err, data) {
    if (err) throw err;
    var pkgjsn = JSON.parse(data.toString('utf8'));

    if (pkgjsn.dependencies) {
      helpers.seedDependencies(pkgjsn.dependencies);
    }

    if (pkgjsn.devDependencies) {
      helpers.seedDependencies(pkgjsn.devDependencies);
    }

    for (var k in dependencies) {
      helpers.gatherDetails(k);
    }

    // Manually inject Node because it's certainly part of your stack
    dependencies.node = {
      name        : 'Node.js',
      version     : process.versions.node,
      description : 'A JavaScript runtime ✨🐢🚀✨',
      downloads   : 10000000 // A fake number since Node isn't downloaded on npm
    };

    event.on('complete', function() {
      return callback(dependencies);
    });

  });
};
