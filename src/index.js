/* @flow */

import {
  getNpmData,
  curriedMerge,
  pickDownloads,
  filterPrivate } from './utilities';
import {
  readPackageJson,
  fetchEachDependency,
  instantiateDependencies,
  readYarnLock,
  addNode
 } from './helpers';

export function backpat() {
  return new Promise((resolve) => {
    Promise.all([readPackageJson(), readYarnLock()])
    .then((result) => Object.assign({}, ...result))
    .then(instantiateDependencies)
    .then((dependencies) => {
      const merge = curriedMerge(dependencies);
      return getNpmData(dependencies)
      .then(pickDownloads)
      .then(merge);
    })
    .then(fetchEachDependency)
    .then(filterPrivate)
    .then(addNode)
    .then((dependencies) => resolve(dependencies))
    .catch(console.error);
  });
}
