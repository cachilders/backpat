import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import {
  NpmConfig,
  readPackageJson,
  rootDir,
  instantiateDependencies,
  fetchEachDependency,
  fetchDependency,
  resolveDependency,
  addNode,
  nodeDetails
} from './helpers';
import { getNpmData } from './utilities';

chai.use(chaiSpies);

describe('Helpers', function() {

  describe('rootDir', () => {
    it('should be a string', () => {
      expect(rootDir).to.be.a('string');
    });
  });

  describe('nodeDetails', () => {
    it('should be an object', () => {
      expect(nodeDetails).to.be.an('object');
    });
  });

  describe('readPackageJson', () => {

    it('should be a function that accepts one optional argument', () => {
      expect(readPackageJson).to.be.a('function');
      expect(readPackageJson.length).to.equal(0);
    });

    it('should throw TypeError when passed argument that is not a string', () => {
      expect(() => readPackageJson(42)).to.throw(TypeError);
    });

    it('should return a promise object', () => {
      expect(() => readPackageJson().to.be.an.instanceof(Promise));
    });

    it('should throw error when path does not exist', (done) => {
      readPackageJson('').catch((reason) => {
        expect(reason).to.be.an.instanceof(Error);
        done();
      });
    });

    it('should return project\'s parsed package.json', (done) => {
      readPackageJson().then((pkg) => {
        expect(pkg).to.be.an('object');
        expect(pkg).to.contain.all.keys('name', 'description');
        expect(pkg).to.have.any.keys(
          'version',
          'main',
          'scripts',
          'author',
          'license',
          'dependencies',
          'devDependencies'
        );
        done();
      });
    });

  });

  describe('instantiateDependencies', () => {

    const deps = {
      dependencies: {
        flashy: '^3.5.0', stuff: '^0.7.1'
      }
    };

    const devDeps = {
      devDependencies: {
        chai: '^3.5.0', coveralls: '^2.11.15'
      }
    };

    it('should be a function', () => {
      expect(instantiateDependencies).to.be.a('function');
    });

    it('should return a promise when passed an object', () => {
      expect(instantiateDependencies(deps)).to.be.an.instanceof(Promise);
    });

    it('returned promise should eventually resolve into an object', (done) => {
      instantiateDependencies({})
      .then((result) => expect(result).to.be.an('object'));
      done();
    });

    it('resolved promise should be an empty object when provided no \'dependencies\' or \'devDependencies\' keys', (done) => {
      instantiateDependencies({})
      .then((result) => expect(result).to.have.all.keys([]));
      done();
    });

    it('resolved promise should be an object when given only \'dependencies\'', (done) => {
      instantiateDependencies(deps)
      .then((result) => expect(result).to.have.all.keys(['flashy', 'stuff']));
      done();
    });

    it('resolved promise should be an object when given only \'devDependencies\'', (done) => {
      instantiateDependencies(devDeps)
      .then((result) => expect(result).to.have.all.keys(['chai', 'coveralls']));
      done();
    });

    it('resolved promise should be an object when given both \'dependencies\' and \'devDependencies\'', (done) => {
      instantiateDependencies(Object.assign(deps, devDeps))
      .then((result) => expect(result).to.have.all.keys(['flashy', 'stuff', 'chai', 'coveralls']));
      done();
    });

  });

  const deps = {
    "lodash": { version: "4.17.2" },
    "ramda": { version: "0.22.1" }
  };

  describe('NpmConfig', () => {
    it('should be a factory that returns a config object', () => {
      expect(NpmConfig).to.be.a('function');
      const obj = NpmConfig(deps);
      expect(obj).to.be.an('object');
      expect(obj).to.deep.equal({
        hostname: 'api.npmjs.org',
        path: '/downloads/point/last-month/lodash,ramda',
        method: 'GET',
        headers: {
          'User-Agent': 'cachilders/backpat'
        }
      });
    });
  });

  describe('getNpmData', () => {
    it('should be a function', () => {
      expect(getNpmData).to.be.a('function');
    });
    it('should return a promise object', () => {
      expect(getNpmData(deps)).to.be.an.instanceof(Promise);
    });
    it('should make an https GET request', (done) => {
      // const config = NpmConfig(deps);
      getNpmData(deps).then( (result) => {
        expect(result).to.be.an('object');
        expect(result.lodash).to.have.any.keys('downloads');
        expect(result.ramda).to.have.any.keys('downloads');
        done();
      });
    });
  });

  describe('fetchEachDependency', () => {

    const deps = {
      "lodash": { version: "4.17.2" },
      "ramda": { version: "0.22.1" }
    };

    it('should be a function', () => {
      expect(fetchEachDependency).to.be.a('function');
    });

    it('should accept an object as its single parameter', () => {
      expect(fetchEachDependency).to.have.length(1);
      expect(() => fetchEachDependency(deps)).to.not.throw(TypeError);
    });

    it('should throw TypeError when not passed object', () => {
      expect(() => fetchEachDependency('this is a string')).to.throw(TypeError);
      expect(() => fetchEachDependency(42)).to.throw(TypeError);
      expect(() => fetchEachDependency(true)).to.throw(TypeError);
    });

    it('should throw TypeError when passed an array', () => {
      expect(() => fetchEachDependency([])).to.throw(TypeError);
    });

    it('should handle multiple dependencies', () => {
      expect(fetchEachDependency(deps)).to.be.ok;
    });

    // TODO:
    // it('should invoke readPackageJson for each dependency', () => {
    //
    // });

    it('should return a promise object', () => {
      expect(fetchEachDependency(deps)).to.be.an.instanceof(Promise);
    });

    it('should eventually return an object', (done) => {
      fetchEachDependency(deps).then((dependencies) => {
        expect(dependencies).to.be.an('object');
        done();
      });
    });

    it('should eventually map dependencies to objects', (done) => {
      fetchEachDependency(deps).then((dependencies) => {
        expect(Object.keys(dependencies)).to.have.length(2);
        done();
      });
    });

  });

  describe('fetchDependency', () => {

    it('should return a promise object', () => {
      expect(fetchDependency('ramda')).to.be.an.instanceof(Promise);
    });

    it('should accept an string as its single parameter', () => {
      expect(fetchDependency).to.have.length(1);
      expect(() => fetchDependency('ramda')).to.not.throw(TypeError);
    });

    it('should fail when passed an argument that is not a string', () => {
      expect(fetchDependency).to.throw(TypeError);
      expect(() => fetchDependency([])).to.throw(TypeError);
      expect(() => fetchDependency({})).to.throw(TypeError);
    });

    it('should eventually resolve to a dependency\'s package', (done) => {
      fetchDependency('ramda').then((result) => {
        expect(result).to.be.an('object');
        done();
      });
    });

  });

  describe('resolveDependency', () => {

    const dependency = {
      name: 'lodash',
      url: 'https://lodash.com/',
      description: 'Lodash modular utilities.',
    };

    it('should return a promise', () => {
      expect(resolveDependency).to.be.a('function');
      expect(resolveDependency(dependency)).to.be.an.instanceof(Promise);
    });

    it('should eventually return the correct output', (done) => {
      resolveDependency(dependency).then((result) => {
        expect(result).to.have.all.keys('name', 'url', 'description');
        done();
      });
    });

  });

  describe('addNode', () => {
    it('should be a function', () => {
      expect(addNode).to.be.a('function');
    });
  });

});
