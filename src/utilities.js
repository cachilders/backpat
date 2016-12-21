import R from 'ramda';
import { NpmConfig, httpsGetPromise } from './helpers';

const addVersionProp = (val, key) => key = { 'version': removeCaret(val) };
const removeCaret = R.replace(/\^/, '');
const isNotPrivate = R.compose(R.not, R.prop('private'));
const filterPrivate = R.filter(isNotPrivate);
export const formatVersionsAndFilterPrivate = R.compose(R.mapObjIndexed(addVersionProp), filterPrivate);

export const getNpmData = R.compose(httpsGetPromise, NpmConfig);
