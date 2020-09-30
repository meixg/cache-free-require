const fs = require('fs');
const Module = require('module');
const path = require('path');

exports.makeRequire = function(dirname) {
    return function(moduleName) {
        return exports.require(moduleName, dirname);
    }
}

exports.cacheFreeRequire = function(moduleName, dirname) {
    const loaderContext = {context: dirname};
    const module = new NativeModule(filename, loaderContext);
  
    module.paths = NativeModule._nodeModulePaths(loaderContext.context);
    const path = require.resolve(moduleName, {paths: [loaderContext.context, ...module.paths]});
    const content = fs.readFileSync(path, 'utf-8');
    module.filename = filename;

    // json file is parsed and is assigned to the module exports property
    if (filename.endsWith('.js')) {
        module._compile(content, filename);
    }
  
    return module.exports;
}