# cache-free-require

Require modules with no caching in Node.js.

## why

In developing Node.js apps, we need to restart nodeserver every time code changed. Using nodemon maybe a way to solve this. But when the nodeserver is too complicated, it's time consuming to restart.

`cache-free-require` suitable when we frequently change a little parts of code.

`cache-free-require` can require a module with no cache, it will always read the file content.

## how

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
