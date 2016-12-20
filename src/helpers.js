/* @flow */

import https from 'https';
import { readFile } from 'fs';

export const rootDir = process.cwd() + '/';

export const readPackageJson = (f: Function, path: string = rootDir) => {
  if (typeof f !== 'function') {
    throw new TypeError(`Function readPackageJson expected type: function but received ${ typeof f } instead`);
  }
  if (typeof path !== 'string') {
    throw new TypeError(`Function readPackageJson expected type: string but received ${ typeof f } instead`);
  }
  return new Promise((resolve, reject) => {
    readFile(path + '/package.json', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  })
  .then(f)
  .catch((reason) => {
    throw new Error(reason);
  });
};

export function fetchEachDependency(dependencies: {}) {
  if (typeof dependencies !== 'object' || Array.isArray(dependencies)) {
    throw new TypeError(`Function fetchEachDependency expected type: object but received ${ typeof dependencies } instead`);
  }
  return Promise.all(Object.keys(dependencies).map(fetchDependency));
}

export function fetchDependency(dependency: string) {
  if (typeof dependency !== 'string') {
    throw new TypeError(`Function fetchDependency expected type: string but received ${ typeof dependency } instead`);
  }
  return readPackageJson((next) => next, rootDir + 'node_modules/' + dependency);
}

// TODO: MAP new array using MakeDependency
// TODO: REFACTOR to flowtype
export function MakeDependency(dependency: { name: string, homepage: string, description: string, repository: { url: string } }) {
  return {
    name: dependency.name,
    url: dependency.homepage || dependency.repository ?
      dependency.repository.url.replace(/\w*\+/, '') : '',
    description: dependency.description
  };
}

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