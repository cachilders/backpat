import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import { mapDependencyTree } from './macros';
import { rootDir } from './index';

chai.use(chaiSpies);

describe('Macros', function() {

  describe('mapDependencyTree', () => {

    const sampleRoute = mapDependencyTree(`${rootDir}node_modules/rimraf`);

    it('should be a function', () => {
      expect(mapDependencyTree).to.be.a('function');
    });

    it('should return a promise when passed an address', () => {
      expect(sampleRoute).to.be.an.instanceof(Promise);
    });

    it('returned promise should eventually resolve into an object', (done) => {
      sampleRoute
      .then((result) => expect(result).to.be.an('object'));
      done();
    });

    it('resolved object should contain dependency props', (done) => {
      sampleRoute
      .then((result) => expect(result).to.have.all.keys(['glob', 'mkdirp', 'tap']));
      done();
    });

    it('dependency props should contain dependency props', (done) => {
      sampleRoute
      .then((result) => expect(result.glob.dependencies).to.be.an('object'));
      done();
    });

  });

});