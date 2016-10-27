let getPkg = require('./index');

getPkg(function(payload) { console.log('CALLBACK: ', payload) });
