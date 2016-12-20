/* @flow */

import has from 'lodash/has';
import { formatVersionsAndFilterPrivate, getNpmData } from './utilities';
import { readPackageJson } from './helpers';

export function backpat(f: Function) {
  if (typeof f !== 'function') {
    throw new TypeError(`Function backpat expected input type: function but received ${ typeof f } instead`);
  }
  return readPackageJson(f).then((packageJson) => {
    
  });
}

// const deps = {};
// if (has(packageJson, 'dependencies')) {
//   deps.dependencies = formatVersionsAndFilterPrivate(packageJson.dependencies);
//   // Manually inject Node because it's certainly part of your stack
//   deps.dependencies.node = {
//     name        : 'Node.js',
//     version     : process.versions.node,
//     description : 'A JavaScript runtime ✨🐢🚀✨',
//     downloads   : 10000000 // A fake number since Node isn't downloaded on npm
//   };
// }
// if (has(packageJson, 'devDependencies')) {
//   deps.dependencies = formatVersionsAndFilterPrivate(packageJson.devDependencies);
// }
// getNpmData(deps);
// return deps;
// getNpmData(devDeps);
  //
  //
