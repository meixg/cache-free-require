const fs = require('fs');
const Module = require('module');
const path = require('path');

function makeRequire(dirname) {
    return function(moduleName) {
        return exports.require(moduleName, dirname);
    }
}

function cacheFreeRequire(moduleName, dirname, filename) {
    const loaderContext = {context: dirname};
    const paths = Module._nodeModulePaths(loaderContext.context);

    if (!filename) {
        filename = require.resolve(moduleName, {paths: [loaderContext.context, ...paths]});
    }

    const module = new Module(filename, loaderContext);
    module.filename = filename;
    module.paths = paths;

    const content = fs.readFileSync(filename, 'utf-8');
    if (module.filename.endsWith('.json')) {
        module.exports = JSON.parse(content);
    }
    else {
        module._compile(content, filename);
    }
  
    return module.exports;
}

const cacheFreeCondition = [];


function freeCache(condition) {
    if (!Array.isArray(condition)) {
        condition = [condition];
    }

    const allStringOrReg = condition.every(item => 
        typeof item === 'string'
            || Object.prototype.toString.call(item) === '[object RegExp]'
    );
    if (!allStringOrReg) {
        throw Error('Conditions must be string or RegExp!');
    }

    cacheFreeCondition.push(...condition);
}

function shouldCacheFree(id) {
    return !!cacheFreeCondition.find(item => {
        if (typeof item === 'string') {
            return item === id;
        }

        return item.test(id);
    });
}



const originRequire = Module.prototype.require;
Module.prototype.require = function(id) {

    const filename = Module._resolveFilename(id, this, false);
    if (shouldCacheFree(filename)) {

        return cacheFreeRequire(id, this.path, filename);
    }

    return originRequire.call(this, id);
};

module.exports = {
    cacheFreeRequire,
    makeRequire,
    freeCache
};
