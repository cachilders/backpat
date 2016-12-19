import { expect } from 'chai';
import { NpmConfig, readPackageJson } from './helpers';
import { getNpmData } from './ramda';

describe('Helpers', function() {

  describe('readPackageJson', () => {
    it('should be a function', () => {
      expect(readPackageJson).to.be.a('function');
    });
    it('should throw TypeError when passed argument that is not a function', () => {
      expect(readPackageJson).to.throw(TypeError);
      expect(() => readPackageJson(42)).to.throw(TypeError);
      expect(() => readPackageJson('bad input')).to.throw(TypeError);
    });
    it('should return a promise object when passed callback', () => {
      expect(readPackageJson(() => {})).to.be.an.instanceof(Promise);
    });
    it('should throw error when path does not exist', () => {
      // TODO:
      expect().to.be.ok;
    });
    it('should return project\'s parsed package.json', () => {
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

});
