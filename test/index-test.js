var chai    = require('chai');
var backpat = require('../index').backpat;
var vars    = require('../index');

describe('Backpat', function() {
  it('Should be a function', function() {
    chai.expect(backpat).to.be.a('function');
  });
  describe('Properties', function() {
    describe('rootDir', function() {
      it('Should be a string', function() {
        chai.expect(vars.rootDir).to.be.a('string');
      });
    });
    describe('dependencies', function() {
      it('Should be an object', function() {
        chai.expect(vars.dependencies).to.be.a('object');
      });
    });
    describe('event', function() {
      it('Should be an object', function() {
        chai.expect(vars.event).to.be.a('object');
      });
    });
  });
});
