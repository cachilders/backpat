import R from 'ramda';
import { NpmConfig, httpsGetPromise } from './helpers';

const removeCaret = R.replace(/\^/, '');
const isNotPrivate = R.compose(R.not, R.prop('private'));
const filterPrivate = R.filter(isNotPrivate);
export const formatVersionsAndFilterPrivate = R.compose(R.map(removeCaret), filterPrivate);

export const getNpmData = R.compose(httpsGetPromise, NpmConfig);
