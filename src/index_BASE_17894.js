/* @flow */

var fs           = require('fs');
var EventEmitter = require('events');
var helpers      = require('./helpers');

exports.rootDir = process.cwd() + '/';
exports.dependencies = {};
exports.event = new EventEmitter();

exports.backpat = function(callback) {
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

    exports.event.on('complete', function() {
      return callback(exports.dependencies);
    });

  });
};
