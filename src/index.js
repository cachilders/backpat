/* @flow */

var fs           = require('fs');
var EventEmitter = require('events');
import { has } from 'lodash/has';
import { formatVersionsAndFilterPrivate, getNpmData } from './ramda';
import { NpmConfig, httpsGetPromise } from './helpers';

exports.rootDir = process.cwd() + '/';
exports.dependencies = {};
exports.event = new EventEmitter();

exports.backpat = function(callback: Function) {
  if (typeof callback !== 'function') {
    throw new TypeError('backpat should accept type function as input parameter');
  }
  fs.readFile(exports.rootDir + '/package.json', function(err, data) {
    if (err) throw new Error(err);
    var pkgjsn = JSON.parse(data.toString('utf8'));

    if (has('dependencies', pkgjsn)) {
      const deps = formatVersionsAndFilterPrivate(pkgjsn.dependencies);
      getNpmData(deps);
    }

    if (has('devDependencies', pkgjsn)) {
      const devDeps = formatVersionsAndFilterPrivate(pkgjsn.dependencies);
      getNpmData(devDeps);
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
