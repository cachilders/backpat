let util = require('util');
let backpat = require('./index');

// Run this script to test Backpat's output

backpat((result) => process.stdout.write(util.format(result) + '\n')); // formatted
// backpat((result) => process.stdout.write(JSON.stringify(result) + '\n')); //unformatted