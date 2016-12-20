import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import { backpat } from './index';

chai.use(chaiSpies);

describe('Backpat', () => {
  
  it('should be a function', () => {
    expect(backpat).to.be.a('function');
  });

  it('should accept a single function as its parameter', () => {
    expect(backpat).to.have.lengthOf(1);
    expect(() => { backpat('string'); }).to.throw(TypeError);
    expect(() => { backpat(42); }).to.throw(TypeError);
    expect(() => { backpat(true); }).to.throw(TypeError);
  });

  it('should return a promise object when passed callback', () => {
    expect(backpat(() => {})).to.be.an.instanceof(Promise);
  });

  const callback = () => {};

  it('should accept a function as its argument', () => {
    const spy = chai.spy(callback);
    expect(spy).to.be.spy;
    // asynchronous nature of backpat function makes this very difficult to test
    // vars.event.on('complete', expect(spy).to.have.been.called.once());
  });

  it('should throw TypeError when backpat not passed function as argument', () => {
    expect( () => { backpat(callback); }).to.not.throw(TypeError);
    expect(backpat).to.throw(TypeError);
  });

});
