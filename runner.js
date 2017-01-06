let util = require('util');
let backpat = require('./dist/index').backpat;

// Run this script to test Backpat's output
const print = (result) => process.stdout.write(util.format(result) + '\n');
backpat().then(print);
