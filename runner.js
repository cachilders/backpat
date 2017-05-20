let fs = require('fs');
let util = require('util');
let backpat = require('./dist/index').backpat;

// Run this script to test Backpat's output
backpat().then(res => fs.createWriteStream('./test_output.txt').write(util.inspect(res)));
