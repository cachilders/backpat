# Backpat

Backpat is a simple tool for use in automating the production of tech stack
notes in projects. (Looking at you, student coders.)

Install it:

```bash
$ npm install --save backpat
```

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
     url: 'https://github.com/eslint/eslint.git',
     description: 'An AST-based pattern checker for JavaScript.',
     stars: 'Deprecated. Use ["downloads"] instead.',
     downloads: 4038383 },
  mocha:
   { version: '3.1.2',
     name: 'mocha',
     url: 'https://github.com/mochajs/mocha.git',
     description: 'simple, flexible, fun test framework',
     stars: 'Deprecated. Use ["downloads"] instead.',
     downloads: 4001598 }}
```

Simple as that. The Github stargazer count makes filtering the heavy hitters
from the plugins a snap, and the rest is up to the frontend.

**Please note:** Due to Github's _strong_ restriction of unauthenticated calls
I've transitioned from stargazer_count to npm's download count for the prior
month. I'll remove the stars key entirely in a future update. For now it
and the code responsible for the request remain in the project. Fork at
your leisure to build that alternate timeline. Bonus: it's significantly
faster since the npm API allows for batch requests.

Also worth noting: it's all async – so don't worry if you've got kitchen-
sink-grade dependencies.

This is a nascent module that is bound to require some TLC. If you encounter
any rough edges, please don't hesitate to drop me a line. Oh, and _feel free to
submit at PR_. There's still much to be done.