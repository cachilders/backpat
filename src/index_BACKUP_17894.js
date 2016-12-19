/* @flow */

var fs           = require('fs');
var EventEmitter = require('events');
var helpers      = require('./helpers');

exports.rootDir = process.cwd() + '/';
exports.dependencies = {};
exports.event = new EventEmitter();

<<<<<<< 86ee1ca00afa772c43dde860d8832598fb95d385
var packageDeps = new Promise(
  function(resolve, reject) {
    fs.readFile(exports.rootDir + '/package.json', function(err, data) {

      if (err) reject({error: err});

      var pkgjsn = JSON.parse(data.toString('utf8'));

      if (pkgjsn.dependencies) {
        helpers.seedDependencies(pkgjsn.dependencies);
      }

      if (pkgjsn.devDependencies) {
        helpers.seedDependencies(pkgjsn.devDependencies);
      }

      for (var k in exports.dependencies) {
        helpers.gatherDetails(k);
      }

      // Manually inject Node because it's certainly part of your stack
      exports.dependencies.node = {
        name        : 'Node.js',
        version     : process.versions.node,
        description : 'A JavaScript runtime ✨🐢🚀✨',
        downloads   : 10000000 // A fake number since Node isn't downloaded on npm
      };

      exports.event.on('gathered', function() {
        resolve(exports.dependencies);
      });
=======
exports.backpat = function(callback: Function) {
  if (typeof callback !== 'function') {
    throw new TypeError('backpat should accept type function as input parameter');
  }
  fs.readFile(exports.rootDir + '/package.json', function(err, data) {
    if (err) throw err;
    var pkgjsn = JSON.parse(data.toString('utf8'));

    if (pkgjsn.dependencies) {
      helpers.seedDependencies(pkgjsn.dependencies);
    }

    if (pkgjsn.devDependencies) {
      helpers.seedDependencies(pkgjsn.devDependencies);
    }

    for (var k in exports.dependencies) {
      helpers.gatherDetails(k);
    }

    // Manually inject Node because it's certainly part of your stack
    exports.dependencies.node = {
      name        : 'Node.js',
      version     : process.versions.node,
      description : 'A JavaScript runtime ✨🐢🚀✨',
      downloads   : 10000000 // A fake number since Node isn't downloaded on npm
    };
>>>>>>> chore(index): add Function parameter annotation

    });
  }
);

exports.backpat = function(callback) {
  packageDeps
    .then(function(results) {
      return Promise.resolve(callback(results));
    })
    .then(function() {
      exports.event.emit('complete');
    }), function(error) {
      console.err(error);
    };
};
