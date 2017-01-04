/* @flow */

import { getNpmData } from './utilities';
import {
  readPackageJson,
  fetchEachDependency,
  instantiateDependencies } from './helpers';

export function backpat(f: Function) {
  if (typeof f !== 'function') {
    throw new TypeError(`Function backpat expected input type: function but received ${ typeof f } instead`);
  }
  return new Promise(() => {
    readPackageJson()
    .then(instantiateDependencies)
    .then((dependencies) => {
      return getNpmData(dependencies)
      .then((npmData) => {
        Object.keys(npmData).forEach((key) => {
          dependencies[key].downloads = npmData[key].downloads;
        });
        return dependencies;
      });
    })
    .then(fetchEachDependency)
    .then((dependencies) => {
      dependencies.node = {
        name        : 'Node.js',
        url         : 'https://nodejs.org',
        version     : process.versions.node,
        description : 'A JavaScript runtime ✨🐢🚀✨',
        downloads   : 10000000 // A fake number since Node isn't downloaded on npm
      };
      return dependencies;
    })
    .then(f);
  });
}
