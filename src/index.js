/* @flow */

import { getNpmData, curriedMerge, pickDownloads } from './utilities';
import {
  readPackageJson,
  fetchEachDependency,
  instantiateDependencies,
  addNode
 } from './helpers';

export function backpat(f: Function) {
  if (typeof f !== 'function') {
    throw new TypeError(`Function backpat expected input type: function but received ${ typeof f } instead`);
  }
  return new Promise(() => {
    readPackageJson()
    .then(instantiateDependencies)
    .then((dependencies) => {
      const merge = curriedMerge(dependencies);
      return getNpmData(dependencies)
      .then(pickDownloads)
      .then(merge);
    })
    .then(fetchEachDependency)
    .then(addNode)
    .then(f);
  });
}
