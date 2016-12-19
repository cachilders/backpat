import { expect } from 'chai';
import { NpmConfig } from './helpers';

describe('Helpers', function() {
  describe('NpmConfig', () => {
    const deps = {
        "lodash": "4.17.2",
        "ramda": "0.22.1"
    };
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
});
