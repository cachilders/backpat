/* @flow */

import 'babel-polyfill';
import {
  getNpmData,
  curriedMerge,
  pickDownloads } from './utilities';
import { addNode, mapDependencyTree } from './helpers';

export function backpat() {
  return new Promise((resolve) => {
    mapDependencyTree()
      .then((dependencies) => {
        const merge = curriedMerge(dependencies.flat);
        return getNpmData(dependencies.flat)
          .then(pickDownloads)
          .then(merge)
          .then(() => dependencies);
      })
      .then((dependencies) => dependencies.nested)
      .then(addNode)
      .then((dependencies) => resolve(dependencies))
      .catch(console.error);
  });
}
