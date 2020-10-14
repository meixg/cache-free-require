const {
    cacheFreeRequire,
    freeCache
} = require('../src/index');

freeCache([
    /\.\/child$/,
    './samples/parent.js'
]);


setInterval(() => {
    // const bbb = cacheFreeRequire('./samples/parent.js', __dirname, 'aaa.json');
    // const bbb = cacheFreeRequire('./aaa.json', __dirname, 'aaa.json');
    const bbb = require('./samples/parent.js');
    console.log(bbb);
}, 1000);