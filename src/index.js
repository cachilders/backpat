/* @flow */

import { getNpmData, curriedMerge, pickDownloads } from './utilities';
import {
  readPackageJson,
  fetchEachDependency,
  instantiateDependencies,
  addNode
 } from './helpers';

export function backpat() {
  return new Promise((resolve) => {
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
    .then((dependencies) => resolve(dependencies))
    .catch(console.error);
  });
}
