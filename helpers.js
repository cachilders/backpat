var https = require('https');

// Add modules and their versions to the dependencies object
module.exports = {};

module.exports.seedDependencies(obj) = function() {
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
module.exports.gatherDetails(module) = function() {
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
module.exports.fetchModuleDownloads = function() {
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