import R from 'ramda';
import { NpmConfig, httpsGetPromise } from './helpers';

export const removeSemverCharacter = R.replace(/[\^\~\<\>][\=]?/, '');
export const addVersionProp = (v, k, o) => o[k] = { 'version': removeSemverCharacter(v) };
export const pickDownloads = R.map(R.pick(['downloads']));
export const formatVersions = R.mapObjIndexed(addVersionProp);
export const deeplyMerge = (obj1, obj2) => R.mapObjIndexed((v, k, o) => R.merge(obj1[k], obj2[k]), obj1);
export const curriedMerge = R.curry(deeplyMerge);
export const getNpmData = R.compose(httpsGetPromise, NpmConfig);
export const isNotPrivate = R.compose(R.not, R.prop('private'));
export const filterPrivate = R.filter(isNotPrivate);
