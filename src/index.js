const fs = require('fs');
const NativeModule = require('module');

exports.makeRequire = function(dirname) {
    return function(moduleName, filename) {
        return exports.require(moduleName, dirname, filename);
    }
}

exports.cacheFreeRequire = function(moduleName, dirname, filename = 'temp-file.js') {
    const loaderContext = {context: dirname};
    const module = new NativeModule(filename, loaderContext);
  
    module.paths = NativeModule._nodeModulePaths(loaderContext.context);
    const path = require.resolve(moduleName, {paths: [loaderContext.context, ...module.paths]});
    const content = fs.readFileSync(path, 'utf-8');
    module.filename = filename;
    module._compile(content, filename);
  
    return module.exports;
}