# Backpat

Backpat is a simple tool for use in the automating the production of tech
stack notes in projects. (Looking at you, student coders.)

Require it like so:

```javascript
const backpat = require('backpat');
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
     url: 'http://eslint.org',
     description: 'An AST-based pattern checker for JavaScript.',
     stars: 6170 },
  mocha:
   { version: '3.1.2',
     name: 'mocha',
     url: 'https://mochajs.org',
     description: 'simple, flexible, fun test framework',
     stars: 10661 }
```

Simple as that. The Github stargazer count makes filtering the heavy hitters
from the plugins a snap, and the rest is up to the frontend.

**Please note: Github strongly limits unauthenticated API calls. If you get
undefined for many or all of your dependencies' stars, the limit for theapp has
reached for the given hour. This is less than ideal and a solution is in the
works.

Also worth noting: it's all async – so don't worry if you've got kitchen-
sink-grade dependencies.

This is a nascent module that is bound to require some TLC. If you encounter
any rough edges, please don't hesitate to drop me a line. Oh, and feel free to
submit at PR.