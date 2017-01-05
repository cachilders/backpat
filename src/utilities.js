import R from 'ramda';
import { NpmConfig, httpsGetPromise } from './helpers';

const addVersionProp = (val, key, obj) => obj[key] = { 'version': removeCaret(val) };
const removeCaret = R.replace(/\^/, '');
const isNotPrivate = R.compose(R.not, R.prop('private'));
const filterPrivate = R.filter(isNotPrivate);
const pickProps = R.curry(R.pick);

const deeplyMerge = (obj1, obj2) => {
  return R.keys(obj1).reduce((result, key) => {
    result[key] = R.merge(obj1[key], obj2[key]);
    return result;
  }, {});
};

export const addNode = (obj) => {
  obj.node = {
    name        : 'Node.js',
    url         : 'https://nodejs.org',
    version     : process.versions.node,
    description : 'A JavaScript runtime ✨🐢🚀✨',
    downloads   : 10000000 // A fake number since Node isn't downloaded on npm
  };
  return obj;
};

export const pickDownloads = R.map(pickProps(['downloads']));
export const curriedMerge = R.curry(deeplyMerge);
export const formatVersionsAndFilterPrivate = R.compose(R.mapObjIndexed(addVersionProp), filterPrivate);
export const getNpmData = R.compose(httpsGetPromise, NpmConfig);
