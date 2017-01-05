import R from 'ramda';
import { NpmConfig, httpsGetPromise } from './helpers';

const removeCaret = R.replace(/\^/, '');
const addVersionProp = (v, k, o) => o[k] = { 'version': removeCaret(v) };
const isNotPrivate = R.compose(R.not, R.prop('private'));
const filterPrivate = R.filter(isNotPrivate);
const deeplyMerge = (obj1, obj2) => R.mapObjIndexed((v, k, o) => R.merge(obj1[k], obj2[k]), obj1);
const pickProps = R.curry(R.pick);

export const formatVersionsAndFilterPrivate = R.compose(R.mapObjIndexed(addVersionProp), filterPrivate);
export const curriedMerge = R.curry(deeplyMerge);
export const getNpmData = R.compose(httpsGetPromise, NpmConfig);
export const pickDownloads = R.map(pickProps(['downloads']));
