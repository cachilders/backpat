/* @flow */

import { formatVersionsAndFilterPrivate, getNpmData } from './utilities';
import { readPackageJson } from './helpers';

const deps = {};

export function backpat(f: Function) {
  if (typeof f !== 'function') {
    throw new TypeError(`Function backpat expected input type: function but received ${ typeof f } instead`);
  }
  return readPackageJson(f).then((packageJson) => {
    Object.assign(deps,
      packageJson.dependencies ? 
        formatVersionsAndFilterPrivate(packageJson.dependencies) : null,
      packageJson.devDependencies?
        formatVersionsAndFilterPrivate(packageJson.devDependencies): null,
      { node: {
        name        : 'Node.js',
        version     : process.versions.node,
        description : 'A JavaScript runtime ✨🐢🚀✨',
        downloads   : 10000000 // A fake number since Node isn't downloaded on npm
      } }
    );
    f(deps);
  });
}

// getNpmData(deps);
// return deps;
// getNpmData(devDeps);
