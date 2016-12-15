# Backpat

-[![Build Status](https://travis-ci.org/cachilders/backpat.png?branch=master)](https://travis-ci.org/cachilders/backpat) [![Coverage Status](https://coveralls.io/repos/github/cachilders/backpat/badge.svg?branch=master)](https://coveralls.io/github/cachilders/backpat?branch=master)-

Backpat is a simple tool for use in automating the production of tech stack
notes in projects. Think along the lines of About pages with links for crediting
community contributions to your codebase. (Looking at you, student developers.)

Install it as such:

```bash
$ npm install --save backpat
```

**New in 0.4.0:** Require it like so:

```javascript
const backpat = require('backpat').backpat;
```

Invoke it thusly:

```javascript
backpat(callback);
```

And it will parse your project's ```package.json```, identifying all production
and developer dependencies and fetching the particulars of each. What you'll
get back is an object like this, if considerably more robust.

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

Simple as that. The npm download count attribute makes filtering the results
a snap.

Worth noting: the whole shebang is async – so don't worry if you've got kitchen-
sink-grade dependencies.

This is a nascent module that is bound to require some TLC. If you encounter
any rough edges, please don't hesitate to drop me a line. Oh, and _feel free to
submit at PR_. There's still much to be done.
