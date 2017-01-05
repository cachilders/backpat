import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import { backpat } from './index';

chai.use(chaiSpies);

describe('Backpat', () => {
  
  it('should be a function', () => {
    expect(backpat).to.be.a('function');
  });

  it('should return a promise object when passed callback', () => {
    expect(backpat(() => {})).to.be.an.instanceof(Promise);
  });

  it('should eventually return an object', (done) => {
    backpat().then((dependencies) => {
      expect(dependencies).to.be.an('object');
      done();
    });
  });

});
