import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import { backpat, rootDir } from './index';

chai.use(chaiSpies);

describe('Backpat', () => {

  describe('rootDir', () => {
    it('should be a string', () => {
      expect(rootDir).to.be.a('string');
    });
  });
  
  it('should be a function', () => {
    expect(backpat).to.be.a('function');
  });

  it('should return a promise object when invoked', () => {
    expect(backpat(() => {})).to.be.an.instanceof(Promise);
  });

  it('should eventually resolve into an object', (done) => {
    backpat().then((dependencies) => {
      expect(dependencies).to.be.an('object');
      done();
    });
  });

});
