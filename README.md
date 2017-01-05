# Backpat [![Build Status](https://travis-ci.org/cachilders/backpat.svg?branch=master)](https://travis-ci.org/cachilders/backpat) [![Coverage Status](https://coveralls.io/repos/github/cachilders/backpat/badge.svg?branch=master)](https://coveralls.io/github/cachilders/backpat?branch=master)

Backpat is a simple tool for use in automating the production of tech stack
notes in projects. Think along the lines of About pages with links for crediting
community contributions to your codebase. (Looking at you, student developers.)

Install it as such:

```bash
$ npm install --save backpat
```

Require it like so:

```javascript
const backpat = require('backpat').backpat;
```

**As of v0.6.0**: Invoke it thusly:

```javascript
backpat().then('do stuff with it here');
```

And it will parse your project's ```package.json```, identifying all production
and developer dependencies and fetching the particulars of each. **What you'll
get back is a promise** that will eventually resolve into an object like this:

```javascript
{ eslint:
   { version: '3.8.1',
     name: 'eslint',
     url: 'https://github.com/eslint/eslint.git',
     description: 'An AST-based pattern checker for JavaScript.',
     downloads: 4038383 },
  mocha:
   { version: '3.1.2',
     name: 'mocha',
     url: 'https://github.com/mochajs/mocha.git',
     description: 'simple, flexible, fun test framework',
     downloads: 4001598 }}
```

Simple as that. The npm download count attribute makes ranking and filtering the
results a snap.

That's it. _Feel free to submit an issue or PR_.
