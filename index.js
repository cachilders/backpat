/* @flow */
"use strict";
var path  = require('path');
var fs    = require('fs');
var https = require('https');

var rootDir = process.cwd() + '/';

var pkgjsn;
var dependencies = {};

module.exports = function(callback) { //Requires annotation for Flow
  fs.readFile(rootDir + '/package.json', function(err, data) {
    if (err) throw err;
    pkgjsn = JSON.parse(data.toString('utf8'));

    if (pkgjsn.dependencies) {
      seedDependencies(pkgjsn.dependencies);
    }

    if (pkgjsn.devDependencies) {
      seedDependencies(pkgjsn.devDependencies);
    }

    for (var k in dependencies) {
      gatherDetails(k);
    }

    dependencies.node = {
      name: 'Node.js',
      version: process.versions.node,
      description: 'A JavaScript runtime ✨🐢🚀✨',
      stars: ''
    }

    gitStarCount('nodejs/node', dependencies.node);

    callback(dependencies);

  });
}


function seedDependencies(obj) {
  Object.keys(obj)
  .forEach(function(dependency) {
    if (!dependency.private) {
      dependencies[dependency] = {
        version: obj[dependency].replace(/\^/,''),
      };
    }
  });
}

function gatherDetails(module) {
  var modulePath = rootDir + 'node_modules/' + module + '/package.json';
  var dependency = dependencies[module];
  fs.readFile(modulePath, function(err, data) {
    var details = JSON.parse(data.toString('utf8'));
    dependency.name = details.name;
    dependency.url = details.homepage || details.repository.url.replace(/git\+/, '');
    dependency.description = details.description;
    gitStarCount(details.repository.url, dependency);
  });
}

function gitStarCount(url, dependency) {
  var httpOptions = {
    hostname: 'api.github.com',
    path: '/repos/' + url.replace(/git|\+https:\/\/github.com\/|\./g, ''),
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
    dependency.stars = JSON.parse(result.toString('utf8')).stargazers_count;
  })
}
