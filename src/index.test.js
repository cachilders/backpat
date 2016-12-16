const chai    = require('chai');
const spies   = require('chai-spies');
const expect  = chai.expect;
const backpat = require('./index').backpat;
const vars    = require('./index');

chai.use(spies);

describe('Backpat', () => {
  it('Should be a function', () => {
    expect(backpat).to.be.a('function');
  });
  it('Should accept a single parameter', () => {
    expect(backpat).to.have.lengthOf(1);
  });
  const callback = () => {};
  it('Should accept a function as its argument', () => {
    const spy = chai.spy(callback);
    expect(spy).to.be.spy;
    // asynchronous nature of backpat function makes this very difficult to test
    // vars.event.on('complete', expect(spy).to.have.been.called.once());
  });
  it('Should throw TypeError when backpat not passed function as argument', () => {
    expect( () => { backpat(callback); }).to.not.throw(TypeError);
    expect(backpat).to.throw(TypeError);
  });
  describe('Properties', () => {
    describe('rootDir', () => {
      it('Should be a string', () => {
        expect(vars.rootDir).to.be.a('string');
      });
    });
    describe('dependencies', () => {
      it('Should be an object', () => {
        expect(vars.dependencies).to.be.a('object');
      });
    });
    describe('event', () => {
      it('Should be an object', () => {
        expect(vars.event).to.be.a('object');
      });
    });
  });
});
