/* @flow */

var https = require('https');
var fs    = require('fs');

var vars  = require('./index');

module.exports = {
  // Add modules and their versions to the dependencies object
  seedDependencies: function(obj) {
    Object.keys(obj)
    .forEach(function(dependency) {
      if (!dependency.private) {
        vars.dependencies[dependency] = {
          version: obj[dependency].replace(/\^/,''),
        };
      }
    });
    module.exports.fetchModuleDownloads();
  },

  // Fetch each module's package.json and add details from it
  gatherDetails: function(module) {
    var modulePath = vars.rootDir + 'node_modules/' + module + '/package.json';
    var dependency = vars.dependencies[module];
    fs.readFile(modulePath, function(err, data) {
      if (err) console.error(err);
      var details = JSON.parse(data.toString('utf8'));
      dependency.name = details.name;
      dependency.url = details.homepage || details.repository ?
        details.repository.url.replace(/\w*\+/, '') : '' ;
      dependency.description = details.description;
    });
  },

  // Batch retrieve the npm download counts for all modules for the past month
  fetchModuleDownloads: function() {
    var httpOptions = {
      hostname: 'api.npmjs.org',
      path: '/downloads/point/last-month/' + Object.keys(vars.dependencies).join(','),
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

      if (vars.dependencies[key]) {
        vars.dependencies[key].downloads = resultObj[key] ?
          resultObj[key].downloads : null;
        outCount++;
      }
      });

      if (inCount === outCount) {
        vars.event.emit('gathered');
      }

    });
  }
};