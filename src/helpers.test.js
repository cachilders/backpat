import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import {
  NpmConfig,
  readPackageJson,
  rootDir,
  fetchEachDependency,
  fetchDependency,
  MakeDependency
} from './helpers';
import { getNpmData } from './ramda';

chai.use(chaiSpies);

describe('Helpers', function() {

  describe('rootDir', () => {

    it('should be a string', () => {
      expect(rootDir).to.be.a('string');
    });

  });

  describe('readPackageJson', () => {

    it('should be a function that accepts one argument and one optional argument', () => {
      expect(readPackageJson).to.be.a('function');
      expect(readPackageJson.length).to.equal(1);
      // TODO: TEST for optional argument
    });

    it('should throw TypeError when passed argument that is not a function', () => {
      expect(readPackageJson).to.throw(TypeError);
      expect(() => readPackageJson(42)).to.throw(TypeError);
      expect(() => readPackageJson('bad input')).to.throw(TypeError);
    });

    it('should throw TypeError when passed argument that is not a string', () => {
      expect(() => readPackageJson(() => {}, 42)).to.throw(TypeError);
    });

    it('should return a promise object when passed callback', () => {
      expect(readPackageJson(() => {})).to.be.an.instanceof(Promise);
    });

    it('should throw error when path does not exist', (done) => {
      readPackageJson(() => {}, '').catch((reason) => {
        expect(reason).to.be.an.instanceof(Error);
        done();
      });
    });

    it('should return project\'s parsed package.json', (done) => {
      readPackageJson((next) => next).then((pkg) => {
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

    // SPY on basic function
    const spy = chai.spy(() => {});

    it('should invoke callback function', (done) => {
      expect(spy).to.be.spy;
      readPackageJson(spy).then(() => {
        expect(spy).to.have.been.called.at.least(1);
        done();
      });
    });

  });

  const deps = {
    "lodash": "4.17.2",
    "ramda": "0.22.1"
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
        const response = JSON.parse(result);
        expect(response).to.be.an('object');
        expect(response.lodash).to.have.all.keys('downloads', 'start', 'end', 'package');
        expect(response.ramda).to.have.all.keys('downloads', 'start', 'end', 'package');
        done();
      });
    });
  });

  describe('fetchEachDependency', () => {

    const deps = {
      "lodash": "4.17.2",
      "ramda": "0.22.1"
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

    it('should eventually return an array of promises', (done) => {
      fetchEachDependency(deps).then((dependencies) => {
        expect(dependencies).to.be.an.instanceof(Array);
        done();
      });
    });

    it('should eventually map dependencies to objects', (done) => {
      fetchEachDependency(deps).then((dependencies) => {
        expect(dependencies).to.have.length(2);
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

  describe('MakeDependency', () => {

    const dependency = {
      name: 'lodash',
      url: 'https://lodash.com/',
      description: 'Lodash modular utilities.',
    };

    it('should be a factory that returns an object', () => {
      expect(MakeDependency).to.be.a('function');
      expect(MakeDependency(dependency)).to.be.an('object');
    });

    it('should return the correct output', () => {
      expect(MakeDependency(dependency)).to.have.all.keys('name', 'url', 'description');
    });

  });
});
