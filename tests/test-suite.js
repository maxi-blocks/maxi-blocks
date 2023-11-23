// Import the new test files
const inspectorTests = require('./blocks/container-maxi/inspector.test');
const constantsTests = require('./extensions/DC/constants.test');
const withMaxiContextLoopTests = require('./extensions/DC/withMaxiContextLoop.test');

// Add the new tests to the test suite
describe('Test Suite', () => {
  describe('Inspector Tests', inspectorTests);
  describe('Constants Tests', constantsTests);
  describe('WithMaxiContextLoop Tests', withMaxiContextLoopTests);
});

// Run the test suite
jest.run();
