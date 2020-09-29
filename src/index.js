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
    const module = new Module('fake cache free module', loaderContext);
  
    module.paths = Module._nodeModulePaths(loaderContext.context);
    const filePath = require.resolve(moduleName, {paths: [loaderContext.context, ...module.paths]});
    console.log(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    module.filename = path.basename(filePath);
    console.log(module.filename);

    if (module.filename.endsWith('.json')) {
        module.exports = JSON.parse(content);
    }
    else {
        module._compile(content, filename);
    }
  
    return module.exports;
}