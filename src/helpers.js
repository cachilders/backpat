/* @flow */

import https from 'https';
import { readFile } from 'fs';
import { has } from 'lodash/has';

// var fs    = require('fs');
//
// var vars  = require('./index');
//
// import { formatVersionsAndFilterPrivate } from '';

// module.exports = {
//   // Add modules and their versions to the dependencies object
//   seedDependencies: function(obj: {}) {
//     vars.dependencies = formatVersionsAndFilterPrivate(obj);
//     module.exports.fetchModuleDownloads();
//   },
//
//   // Fetch each module's package.json and add details from it
//   gatherDetails: function(module: string) {
//     var modulePath = vars.rootDir + 'node_modules/' + module + '/package.json';
//     var dependency = vars.dependencies[module];
//     fs.readFile(modulePath, function(err, data) {
//       if (err) console.error(err);
//       var details = JSON.parse(data.toString('utf8'));
//       dependency.name = details.name;
//       dependency.url = details.homepage || details.repository ?
//         details.repository.url.replace(/\w*\+/, '') : '' ;
//       dependency.description = details.description;
//     });
//   },

  // Batch retrieve the npm download counts for all modules for the past month

// httpsGetPromise.then((result) => {
//   var resultObj = JSON.parse(result.toString('utf8'));
//   Object.keys(resultObj).forEach(function(key) {
//     if (vars.dependencies[key]) {
//       vars.dependencies[key].downloads = resultObj[key] ?
//       resultObj[key].downloads : null;
//       outCount++;
//     }
//   });
// })
//

export const rootDir = process.cwd() + '/';

export const readPackageJson = (f: Function) => {
  if (typeof f !== 'function') {
    throw new TypeError(`Expected a function but received ${ typeof f } instead`);
  }
  return new Promise((resolve, reject) => {
    readFile(rootDir + '/package.json', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data.toString()));
    });
  })
  .then(f)
  .catch((reason) => {
    throw new Error(reason);
  });
};

export function NpmConfig(dependencies: {}) {
  return {
    hostname: 'api.npmjs.org',
    path: '/downloads/point/last-month/' + Object.keys(dependencies).join(','),
    method: 'GET',
    headers: {
      'User-Agent': 'cachilders/backpat'
    }
  };
}

export function httpsGetPromise(opts: {}) {
  return new Promise((resolve, reject) => {
    https.get(opts, (res) => {
      const body = [];
      res.on('data', (chunk) => body.push(chunk));
      res.on('end', () => resolve(Buffer.concat(body).toString()));
      res.on('error', reject);
    });
  });
}
