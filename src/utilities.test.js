import { expect } from 'chai';
import {
  pickDownloads,
  curriedMerge,
  formatVersions,
  filterPrivate,
  removeSemverCharacter,
  addVersionProp,
  isNotPrivate,
  deeplyMerge
} from './utilities';

describe('Utilities', () => {

  describe('removeCarat', () => {

    it('should be a function', () => {
      expect(removeSemverCharacter).to.be.a('function');
    });

    it('should return a string when provided a string', () => {
      expect(removeSemverCharacter('^3.5.0')).to.be.a('string');
    });

    it('should return a string with first caret removed', () => {
      expect(removeSemverCharacter('s^tring')).to.equal('string');
    });

    it('should be caret agnostic re: strings', () => {
      expect(removeSemverCharacter('string')).to.equal('string');
    });

  });

  describe('addVersionProp', () => {

    it('should be a function', () => {
      expect(addVersionProp).to.be.a('function');
    });

    // TODO: This one is a little reliant on the calling mapObjIndexed function. Requires a little
    // consideration, but the core functionality is presently tested via formatVersions.

    // it('should return an object when passed an object', () => {
    //   expect(addVersionProp(dep)).to.be.an('object');
    // });

    // it('should return an empty object when passed an empty object', () => {
    //   expect(addVersionProp({})).to.have.all.keys([]);
    // });

    // it('returned object should contain nested object with version key when passed dependency', () => {
    //   expect(addVersionProp(dep).chai).to.have.all.keys(['version']);
    // });

  });

  describe('isNotPrivate', () => {

    it('should be a function', () => {
      expect(isNotPrivate).to.be.a('function');
    });

    // TODO: Tangentially tested as aspect of filterPrivate

  });

  describe('deeplyMerge', () => {

    it('should be a function', () => {
      expect(deeplyMerge).to.be.a('function');
    });

    // TODO: Tangentially tested as core function of curriedMerge

  });

  describe('pickDownloads', () => {

    const npmData = {
      a: {downloads: '3', garbage: 'trash'},
      b: {garbage: 'trash'}
    };

    it('should be a function', () => {
      expect(pickDownloads).to.be.a('function');
    });

    const strippedObject = pickDownloads(npmData);

    it('should return an object when passed an object', () => {
      expect(strippedObject).to.be.an('object');
    });

    it('should return nested objects containing only \'downloads\' prop', () => {
      expect(strippedObject.a).to.have.all.keys(['downloads']);
    });

    it('should return empty nested objects when \'downloads\' key not present', () => {
      expect(Object.keys(strippedObject.b).length).to.equal(0);
    });

  });

  describe('curriedMerge', () => {

    const dependencies = {
      a: {name: "Cheese", version: "1"},
      b: {name: "Burger", version: "3"}
    };

    const npmData = {
      a: {downloads: '3'},
      b: {downloads: '1'}
    };

    it('should be a function', () => {
      expect(curriedMerge).to.be.a('function');
    });

    const mergeDependenciesWith = curriedMerge(dependencies);

    it('should return a function when passed an object', () => {
      expect(mergeDependenciesWith).to.be.a('function');
    });

    const mergedObject = mergeDependenciesWith(npmData);

    it('returned function should return an object when passed an object', () => {
      expect(mergedObject).to.be.an('object');
    });

    it('final object should contain nested objects with merged keys', () => {
      expect(mergedObject.a).to.have.all.keys(['name', 'version', 'downloads']);
    });

  });

  describe('formatVersions', () => {

    const deps = {
      chai: '^3.5.0',
      'chai-spies': '^0.7.1',
      commitizen: '^2.9.0',
      coveralls: '^2.11.15',
    };

    it('should be a function', () => {
      expect(formatVersions).to.be.a('function');
    });

    const formattedDeps = formatVersions(deps);

    it('should return an object when passed an object', () => {
      expect(formattedDeps).to.be.an('object');
    });

    it('returned object should contain nested objects with version key', () => {
      expect(formattedDeps.chai).to.have.all.keys(['version']);
    });

    it('nested version strings should be properly formatted', () => {
      expect(formattedDeps.coveralls.version).to.equal('2.11.15');
    });

  });

  describe('filterPrivate', () => {

    const deps = {
      chai: {private: true},
      'chai-spies': {private: false},
      commitizen: {},
      coveralls: {private: 'yes'},
    };

    it('should be a function', () => {
      expect(filterPrivate).to.be.a('function');
    });

    const filteredDeps = filterPrivate(deps);

    it('should return an object when passed an object', () => {
      expect(filteredDeps).to.be.an('object');
    });

    it('returned object should contain public dependencies', () => {
      expect(filteredDeps).to.have.all.keys(['chai-spies', 'commitizen']);
    });

    it('returned object should not contain private dependencies', () => {
      expect(filteredDeps).to.not.have.any.keys(['chai', 'coveralls']);
    });

  });

});
