/* @flow */

import { rootDir, flatMap } from './index';
import { filterPrivate } from './utilities';
import {
  readPackageJson,
  fetchEachDependency,
  instantiateDependencies,
  readYarnLock } from './helpers';

export function buildDependencyTree(path: string = rootDir) {
  return Promise.all([readPackageJson(path), readYarnLock(path)])
  .then((result) => Object.assign({}, ...result))
  .then(instantiateDependencies)
  .then(filterPrivate)
  .then((result) => fetchEachDependency(result, rootDir))
  .then(async function(obj) {
    for (let k in obj) {
      if (`${k}/` === path.replace(`${rootDir}node_modules/`, '')) {
        obj[k] = 'CIRCULAR';
      } else if (flatMap[k]) {
        obj[k] = flatMap[k];
      } else {
        flatMap[k] = obj[k];
        obj[k].dependencies = await buildDependencyTree(`${rootDir}node_modules/${k}/`);
      }
    }
    return obj;
  })
  .catch((reason) => {throw new Error(reason)});
}
