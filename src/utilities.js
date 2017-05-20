/* @flow */

import R from 'ramda';
import {
  NpmConfig,
  httpsGetPromise,
  readPackageJson,
  fetchEachDependency,
  instantiateDependencies,
  readYarnLock } from './helpers';
import { rootDir, flatMap } from './index';

export const removeSemverCharacter = R.replace(/[\^\~\<\>][\=]?/, '');
export const addVersionProp = (v, k, o) => o[k] = { 'version': removeSemverCharacter(v) };
export const pickDownloads = R.map(R.pick(['downloads']));
export const formatVersions = R.mapObjIndexed(addVersionProp);
export const deeplyMerge = (obj1, obj2) => R.mapObjIndexed((v, k, o) => R.merge(obj1[k], obj2[k]), obj1);
export const curriedMerge = R.curry(deeplyMerge);
export const getNpmData = R.compose(httpsGetPromise, NpmConfig);
export const isNotPrivate = R.compose(R.not, R.prop('private'));
export const filterPrivate = R.filter(isNotPrivate);
export const mapDependencyTree = (path: string = rootDir) => {
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
        obj[k].dependencies = await mapDependencyTree(`${rootDir}node_modules/${k}/`);
      }
    }
    return obj;
  });
};
