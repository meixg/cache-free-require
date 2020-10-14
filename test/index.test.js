const {writeFileSync} = require('fs');
const path = require('path');
const {freeCache} = require('../src/index');

freeCache([
    /child1/,
    './sample/parent'
]);

const codes = {
    parent: {
        before: `const child = require('./children/child1');
        const child2 = require('./children/child2');

        exports.b = child.a + '222' + child2.b;`,
        after: `const child = require('./children/child1');
        const child2 = require('./children/child2');

        exports.b = child.a + '222222' + child2.b;`
    },
    child1: {
        before: `exports.a = 111;`,
        after: 'exports.a = 111111;'
    },
    child2: {
        before: `exports.b = 333;`,
        after: `exports.b = 333333;`
    }
};

writeFileSync(path.resolve(__dirname, './sample/parent.js'), codes.parent.before);
writeFileSync(path.resolve(__dirname, './sample/children/child1.js'), codes.child1.before);
writeFileSync(path.resolve(__dirname, './sample/children/child2.js'), codes.child2.before);
let res = require('./sample/parent').b;
expectEqual(res, '111222333');

writeFileSync(path.resolve(__dirname, './sample/parent.js'), codes.parent.after);
res = require('./sample/parent').b;
expectEqual(res, '111222222333');

writeFileSync(path.resolve(__dirname, './sample/children/child1.js'), codes.child1.after);
res = require('./sample/parent').b;
expectEqual(res, '111111222222333');

writeFileSync(path.resolve(__dirname, './sample/children/child2.js'), codes.child2.after);
res = require('./sample/parent').b;
expectEqual(res, '111111222222333');


console.log('test pass');

function expectEqual(a, b) {
    if (a !== b) {
        console.error('Expected: ' + b + '\nReceived: ' + a);
        throw Error('test failed');
    }
}
