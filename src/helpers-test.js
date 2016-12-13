var chai    = require('chai');
var helpers = require('./helpers');

describe('Helpers', function() {
  it('Should be an object', function() {
    chai.expect(helpers).to.be.a('object');
  });
  describe('Methods', function() {
    describe('seedDependencies', function() {
      it('Should be a function', function() {
        chai.expect(helpers.seedDependencies).to.be.a('function');
      });
    });
    describe('gatherDetails', function() {
      it('Should be a function', function() {
        chai.expect(helpers.gatherDetails).to.be.a('function');
      });
    });
    describe('fetchModuleDownloads', function() {
      it('Should be a function', function() {
        chai.expect(helpers.fetchModuleDownloads).to.be.a('function');
      });
    });
  });
});
