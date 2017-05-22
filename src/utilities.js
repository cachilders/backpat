/* @flow */

import R from 'ramda';
import {
  chopDependencies,
  NpmConfig,
  httpsGetPromise,
  fetchEachDependency,
  rootDir } from './helpers';

export const removeSemverCharacter = R.replace(/[\^\~\<\>][\=]?/, '');
export const addVersionProp = (v: string, k: string, o: {}) => o[k] = { 'version': removeSemverCharacter(v) };
export const pickDownloads = R.map(R.pick(['downloads']));
export const formatVersions = R.mapObjIndexed(addVersionProp);
export const deeplyMerge = (obj1: {}, obj2: {}) => R.mapObjIndexed((v, k, o) => R.merge(obj1[k], obj2[k]), obj1);
export const curriedMerge = R.curry(deeplyMerge);
export const filterScopedDeps = (dependencies) => Object.keys(dependencies || {}).filter((key) => key.match(/\@/) === null)
export const getNpmData = R.compose(httpsGetPromise, NpmConfig, chopDependencies, filterScopedDeps);
export const isNotPrivate = R.compose(R.not, R.prop('private'));
export const filterPrivate = R.filter(isNotPrivate);

export const assignObjectArray = (objectArray: []) => R.merge(...objectArray);
export const fetchDependencies = (dependencies: {}) => fetchEachDependency(dependencies, rootDir);
export const bundleWithFlatMap = (dependencies: {}) => ({nested: dependencies, flat: {}});
