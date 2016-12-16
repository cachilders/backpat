/* @flow */

var _ = require('ramda');
var https = require('https');
var fs    = require('fs');

var vars  = require('./index');

const isNotPrivate = _.compose(_.not, _.prop('private'));
const filterPrivate = _.filter(isNotPrivate);
const removeCaret = _.replace(/\^/, '');
// TODO: RENAME something more expressive and less awkward
const formatVersionsAndFilterPrivate = _.map(removeCaret, filterPrivate);

module.exports = {
  // Add modules and their versions to the dependencies object
  seedDependencies: function(obj: {}) {
    vars.dependencies = formatVersionsAndFilterPrivate(obj);
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
