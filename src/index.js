/* @flow */

import 'babel-polyfill';
import {
  getNpmData,
  curriedMerge,
  pickDownloads } from './utilities';
import { addNode } from './helpers';
import { mapDependencyTree } from './macros';

export const rootDir = process.cwd() + '/';
export const flatMap = {};

let obj;

export function backpat() {
  return new Promise((resolve) => {
    // Break this into a module to be used recursively
    mapDependencyTree()
    .then((deps) => obj = deps)
    .then(() => {
      const merge = curriedMerge(flatMap);
      return getNpmData(flatMap)
      .then(pickDownloads)
      .then(merge);
    })
    .then(() => obj)
    .then(addNode)
    .then((dependencies) => resolve(dependencies))
    .catch(console.error);
  });
}
