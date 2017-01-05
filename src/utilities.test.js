import chai, { expect } from 'chai';
import {
  pickDownloads,
  curriedMerge,
  formatVersionsAndFilterPrivate,
  addNode
} from './utilities';

describe('Utilities', () => {

  describe('pickDownloads', () => {
    it('should be a function', () => {
      expect(pickDownloads).to.be.a('function');
    });
  });

  describe('curriedMerge', () => {
    it('should be a function', () => {
      expect(curriedMerge).to.be.a('function');
    });
  });

  describe('formatVersionsAndFilterPrivate', () => {
    it('should be a function', () => {
      expect(formatVersionsAndFilterPrivate).to.be.a('function');
    });
  });

  describe('addNode', () => {
    it('should be a function', () => {
      expect(addNode).to.be.a('function');
    });
  });

});
