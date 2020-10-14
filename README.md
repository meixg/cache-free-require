# cache-free-require

Require modules with no caching in Node.js.

## why

In developing Node.js apps, we need to restart Node.js server every time code changed. Using nodemon maybe a way to solve this. But when the Node.js server is too complicated, it's time consuming to restart.

`cache-free-require` is suitable when we frequently change a little parts of code.

`cache-free-require` can require a module with no cache, it will always read the file content.

## how

```javascript
const {freeCache} = require('cache-free-require');

// can be string or RegExp
// if regExp.test(id) === true or string === id
// there will be no cache
freeCache([
    /app\/index\.js/,
    './child',
]);

require('app/index.js');
```

or by single require

```javascript
const {cacheFreeRequire} = require('cache-free-require');
cacheFreeRequire('./path/to/module', __dirname);
cacheFreeRequire('some-module', __dirname);
```

or

```javascript
const {makeRequire} = require('cache-free-require');
const cacheFreeRequire = makeRequire(__dirname);

cacheFreeRequire('./path/to/module');
cacheFreeRequire('some-module');
```

## notice

- Only support `.js` and `.json`, other file will be treated as `.js`.
- Only can be used on files with no state, otherwise the state will not be persisted.