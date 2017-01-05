/* @flow */

import https from 'https';
import { readFile } from 'fs';
import { formatVersionsAndFilterPrivate } from './utilities';

export const rootDir = process.cwd() + '/';
export const nodeDetails = {
  node: {
    name        : 'Node.js',
    url         : 'https://nodejs.org',
    version     : process.versions.node,
    description : 'A JavaScript runtime ✨🐢🚀✨',
    downloads   : 10000000 // A fake number since Node isn't downloaded on npm
  }
};

export const readPackageJson = (path: string = rootDir) => {
  if (typeof path !== 'string') {
    throw new TypeError(`Function readPackageJson expected type: string but received ${ typeof path } instead`);
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
  .catch((reason) => {
    throw new Error(reason);
  });
};

export function instantiateDependencies(packageJson: {}) {
  return new Promise((resolve) => {
    const dependencies = {};
    Object.assign(dependencies,
      packageJson.dependencies ? 
        formatVersionsAndFilterPrivate(packageJson.dependencies) : null,
      packageJson.devDependencies?
        formatVersionsAndFilterPrivate(packageJson.devDependencies): null,
    );
    resolve(dependencies);
  });
}

export function fetchEachDependency(dependencies: {}) {
  if (typeof dependencies !== 'object' || Array.isArray(dependencies)) {
    throw new TypeError(`Function fetchEachDependency expected type: object but received ${ typeof dependencies } instead`);
  }
  return Promise.all(Object.keys(dependencies).map(fetchDependency))
  .then((properties) => {
    properties.forEach((property) => {
      Object.assign(dependencies[property.name], property);
    });
    return dependencies;
  });
}

export function fetchDependency(dependency: string) {
  if (typeof dependency !== 'string') {
    throw new TypeError(`Function fetchDependency expected type: string but received ${ typeof dependency } instead`);
  }
  return readPackageJson(rootDir + 'node_modules/' + dependency)
  .then(resolveDependency);
}

export function resolveDependency(dependency: { name: string, homepage: string, description: string, repository: { url: string } }) {
  return new Promise((resolve) => {
    resolve({
      name: dependency.name,
      url: dependency.homepage || dependency.repository ?
        dependency.repository.url.replace(/\w*\+/, '') : '',
      description: dependency.description
    });
  });
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
      res.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())));
      res.on('error', reject);
    });
  });
}

export const addNode = (dependencies: {}) => Object.assign({}, dependencies, nodeDetails);
