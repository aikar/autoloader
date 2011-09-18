//  Copyright (c) 2011 Daniel Ennis <aikar@aikar.co>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var 
  fs = require("fs"),
  path = require("path");


// make sure its loaded first
var fileCache = {};

function defineGlobalGetter(name, fn) {
  global.__defineGetter__(name, function() {    
    delete global[name];
    var val = fn();
    // if the callback function set the global for us, don't overwrite it.
    if (global[name] == undefined) {
      global[name] = val;
    }
    return global[name];
  });
}

function registerAutoloader(path, subpath) {
  subpath = subpath || '/';
  var basePath = path + subpath;
  var files = fs.readdirSync(basePath);
  files.forEach(function(file) {
    var relPath  = subpath + file;
    var fullPath = basePath + file;
    var stat     = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      registerAutoloader(path, relPath + '/');
      var indexFile = basePath + file + '/index.js';
      if (path.existsSync(indexFile)) {
        autoload(relPath + '.js', indexFile);
      }
    } else {
      autoload(relPath, fullPath);
    }
  });
}
function autoload(file, fullPath) {
  var extLoc = file.lastIndexOf('.');
  if (extLoc != -1) {
    var ext = file.substr(extLoc);
    if (require.extensions[ext]) {
      var varName = file.substr(1, extLoc);
      varName = varName.replace(/[^a-z0-9]/gi,'_');
      defineGlobalGetter(varName, function() {
        return require(fullPath);
      });
    }
  }
}

module.exports = registerAutoloader;


