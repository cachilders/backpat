/* @flow */
"use strict";
var path    = require('path');
var fs      = require('fs');

var rootDir = process.cwd() + '/';

var pkgjsn;
var dependencies = {};


fs.readFile(rootDir + '/package.json', function(err, data) {
  if (err) throw err;
  pkgjsn = JSON.parse(data.toString('utf8'));
  if (pkgjsn.dependencies) {
    seedDependencies(pkgjsn.dependencies);
  }
  if (pkgjsn.devDependencies) {
    seedDependencies(pkgjsn.devDependencies);
  }
  console.log(dependencies);
});

module.exports = function() {

}

function seedDependencies(obj) {
  Object.keys(obj)
  .forEach(function(dependency) {
    dependencies[dependency] = {
      version: obj[dependency].replace(/\^/,''),
    };
  });
}

function gatherDetails(module) {
  
}