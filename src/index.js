const fs = require('fs');
const Module = require('module');

exports.makeRequire = function(dirname) {
    return function(moduleName, filename) {
        return exports.require(moduleName, dirname, filename);
    }
}

exports.cacheFreeRequire = function(moduleName, dirname, filename = 'temp-file.js') {
    const loaderContext = {context: dirname};
    const module = new Module(filename, loaderContext);
  
    module.paths = Module._nodeModulePaths(loaderContext.context);
    const path = require.resolve(moduleName, {paths: [loaderContext.context, ...module.paths]});
    console.log(path);
    const content = fs.readFileSync(path, 'utf-8');
    module.filename = filename;

    // json file is parsed and is assigned to the module exports property
    if (filename.endsWith('.js')) {
        module._compile(content, filename);
    }
  
    return module.exports;
}