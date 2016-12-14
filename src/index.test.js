var chai    = require('chai');
var spies   = require('chai-spies');
var expect  = chai.expect;
var backpat = require('./index').backpat;
var vars    = require('./index');

chai.use(spies);

describe('Backpat', function() {
  it('Should be a function', function() {
    expect(backpat).to.be.a('function');
  });
  it('Should accept a single parameter', function() {
    expect(backpat).to.have.lengthOf(1);
  });

  it('Should accept a function as its argument', function() {
    var callback = function(){};
    var spy = chai.spy(callback);
    backpat(spy);
    // asynchronous nature of backpat function makes this very difficult to test
    vars.event.on('complete', expect(spy).to.have.been.called.once());
  });
  describe('Properties', function() {
    describe('rootDir', function() {
      it('Should be a string', function() {
        expect(vars.rootDir).to.be.a('string');
      });
    });
    describe('dependencies', function() {
      it('Should be an object', function() {
        expect(vars.dependencies).to.be.a('object');
      });
    });
    describe('event', function() {
      it('Should be an object', function() {
        expect(vars.event).to.be.a('object');
      });
    });
  });
});
