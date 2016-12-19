import { expect } from 'chai';
import { NpmConfig } from './helpers';
import { getNpmData } from './ramda';

describe('Helpers', function() {

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
