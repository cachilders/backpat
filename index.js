/* @flow */
"use strict";

var path         = require('path');
var fs           = require('fs');
var https        = require('https');
var EventEmitter = require('events').EventEmitter;

var rootDir      = process.cwd() + '/';
var dependencies = {};
var event        = new EventEmitter();

module.exports = function(callback) {
  fs.readFile(rootDir + '/package.json', function(err, data) {
    if (err) throw err;
    var pkgjsn = JSON.parse(data.toString('utf8'));

    if (pkgjsn.dependencies) {
      seedDependencies(pkgjsn.dependencies);
    }

    if (pkgjsn.devDependencies) {
      seedDependencies(pkgjsn.devDependencies);
    }

    for (var k in dependencies) {
      gatherDetails(k);
    }

    // Manually inject Node because it's certainly part of your stack
    dependencies.node = {
      name        : 'Node.js',
      version     : process.versions.node,
      description : 'A JavaScript runtime ✨🐢🚀✨',
      stars       : 'Deprecated. Use ["downloads"] instead.',
      downloads   : 1000000 // A fake number since Node isn't downloaded on npm
    }

    event.on('complete', function() {
      callback(dependencies);
    });

  });
}

// Add modules and their versions to the dependencies object
function seedDependencies(obj) {
  Object.keys(obj)
  .forEach(function(dependency) {
    if (!dependency.private) {
      dependencies[dependency] = {
        version: obj[dependency].replace(/\^/,''),
      };
    }
  });
  fetchModuleDownloads();
}

// Fetch each module's package.json and add details from it
function gatherDetails(module) {
  var modulePath = rootDir + 'node_modules/' + module + '/package.json';
  var dependency = dependencies[module];
  fs.readFile(modulePath, function(err, data) {
    var details = JSON.parse(data.toString('utf8'));
    dependency.name = details.name;
    dependency.url = details.homepage || details.repository ?
      details.repository.url.replace(/\w*\+/, '') : '' ;
    dependency.description = details.description;
    // Retaining the deprecated stars key for this version
    dependency.stars = 'Deprecated. Use ["downloads"] instead.'
  });
}

// Batch retrieve the npm download counts for all modules for the past month
function fetchModuleDownloads() {
  var httpOptions = {
    hostname: 'api.npmjs.org',
    path: '/downloads/point/last-month/' + Object.keys(dependencies).join(','),
    method: 'GET',
    headers: {}
  };

  httpOptions.headers['User-Agent'] = 'cachilders/backpat';
  var result = '';
  https.get(httpOptions, function(res) {
    res.on('data', function(data) {
      result += data;
    });
  }).on('error', function(err) {
    console.error(err);
  }).on('close', function() {
    var resultObj = JSON.parse(result.toString('utf8'));
    var inCount = Object.keys(resultObj).length;
    var outCount = 0;
    Object.keys(resultObj).forEach(function(key) {

    if (dependencies[key]) {
      dependencies[key].downloads = resultObj[key] ?
        resultObj[key].downloads : null;
      outCount++;
    }
    });

    if (inCount === outCount) {
      event.emit('complete');
    }

  });
}

// Leaving this here for posterity. Feel free to fork a version that uses
// Github stars

// function gitStarCount(url, dependency) {
//   var parse = /git.*\:\/\/git@\w*\.*com\/|\w*.*\:\/\/\w*\.*com\/|\.git/g
//   inCount++;
//   var httpOptions = {
//     hostname: 'api.github.com',
//     path: '/repos/' + url.replace(parse, ''),
//     method: 'GET',
//     headers: {}
//   };

//   httpOptions.headers['User-Agent'] = 'cachilders/backpat';
//   var result = '';
//   https.get(httpOptions, function(res) {
//     res.on('data', function(data) {
//       result += data;
//     });
//   }).on('error', function(err) {
//     outCount++;
//     console.error(err);
//   }).on('close', function() {
//     outCount++;
//     dependency.stars = JSON.parse(result.toString('utf8')).stargazers_count;

//     if (inCount === outCount) {
//       event.emit('complete');
//     }

//   });
// }
