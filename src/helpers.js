/* @flow */

import https from 'https';
import { readFile } from 'fs';
import { formatVersions } from './utilities';

export const rootDir = process.cwd() + '/';
export const nodeDetails = {
  node: {
    name        : 'Node.js',
    url         : 'https://nodejs.org',
    version     : process.versions.node,
    description : 'A JavaScript runtime ✨🐢🚀✨',
    downloads   : 100000000 // A fake number since Node isn't downloaded on npm
  }
};

export const readPackageJson = (path: string = rootDir, dependency) => {
  if (typeof path !== 'string') {
    throw new TypeError(`Function readPackageJson expected type: string but received ${ typeof path } instead`);
  }
  if (dependency) path = path + dependency;
  return new Promise((resolve, reject) => {
    readFile(`${path}/package.json`, (err, data) => {
        if (err) {
          resolve({name: dependency});
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
  });
};

export const readYarnLock = (path: string = rootDir) => {
  if (typeof path !== 'string') {
    throw new TypeError(`Function readYarnLock expected type: string but received ${ typeof path } instead`);
  }
  return new Promise((resolve) => {
    readFile(`${path}/yarn.lock`, (err, data) => {
      if (err) {
        resolve({yarnDependencies: {}});
      } else {
        const lockArray = data.toString().match(/\w.*\@.*(?=:)/g);
        const yarnDeps = {
          yarnDependencies: lockArray.reduce((deps, dep) => {
            deps[dep.replace(/\@.*/, '')] = dep.replace(/.*[\@\^\~\=\>\<]/, '');
            return deps;
          }, {}),
        };
        resolve(yarnDeps);
      }
    });
  });
};

export function instantiateDependencies(packageJson: {}) {
  return new Promise((resolve) => {
    const dependencies = {};
    Object.assign(dependencies,
      packageJson.dependencies ? 
        formatVersions(packageJson.dependencies) : null,
      packageJson.devDependencies ?
        formatVersions(packageJson.devDependencies): null,
      packageJson.yarnDependencies ?
        formatVersions(packageJson.yarnDependencies): null,
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
  return readPackageJson(rootDir + 'node_modules/', dependency)
  .then(resolveDependency);
}

export function resolveDependency(dependency: { name: string, homepage: string, description: string, repository: { url: string } }) {
  return new Promise((resolve) => {
    resolve({
      name: dependency.name,
      url: dependency.homepage || (dependency.repository && dependency.repository.url ?
        'https://' + dependency.repository.url.replace(/\w*.*\:\/\/|git@|\.git/g, '') : ''),
      description: dependency.description
    });
  });
}

export function chopDependencies(depChunk: [], depChunks: [] = []) {
  if (depChunk.length === 0) return depChunks;
  if (depChunk.length < 100) {
    depChunks.push(depChunk.join(','));
    return depChunks;
  }
  depChunks.push(depChunk.slice(0, 100).join(','));
  chopDependencies(depChunk.slice(100), depChunks);
  return depChunks;
}

export function NpmConfig(dependencies: {}) {
  const deps = Object.keys(dependencies);
  const depChunks = chopDependencies(deps);

  return depChunks.reduce((optsArray, depChunk) => {
    optsArray.push({
      hostname: 'api.npmjs.org',
      path: '/downloads/point/last-month/' + depChunk,
      method: 'GET',
      headers: {
        'User-Agent': 'cachilders/backpat'
      }
    });
    return optsArray;
  }, []);
}

export function httpsGetPromise(optsArray: []) {
  const promiseArray = optsArray.reduce((promises, opts) => {
    promises.push(new Promise((resolve, reject) => {
      https.get(opts, (res) => {
        const body = [];
        res.on('data', (chunk) => body.push(chunk));
        res.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())));
        res.on('error', reject);
      });
    }));
    return promises;
  }, []);
  return Promise.all(promiseArray)
    .then((results) => Object.assign({}, ...results))
    .catch(console.error);
}

export const addNode = (dependencies: {}) => Object.assign({}, dependencies, nodeDetails);
