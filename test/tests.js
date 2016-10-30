var chai    = require('chai');
var backpat = require('../index');

describe('test', function() {
  it('Should be a function', function() {
    chai.expect(backpat).to.be.a('function');
  });
});
