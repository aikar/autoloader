//  Copyright (c) 2013 Daniel Ennis <aikar@aikar.co>
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
var path = require("path");
var dirMap = [];
var indexMap = [];
function registerAutoloader(filePath, obj) {
  obj = obj || global;
  var index = indexMap.indexOf(obj);
  if (index == -1) {
    index = indexMap.length;
    indexMap.push(obj);
    obj.__proto__ = proxy(obj.__proto__, loadModule);
    dirMap[index] = [];
  }
  dirMap[index].push(filePath);

  function loadModule(key) {
    var file = key.replace(/_/,"/");
    var dirs = dirMap[index];
    for (var i = 0; i < dirs.length; i++) {
      var dir = dirs[i];
      if (typeof dir == 'function') {
        var result = dir(key, obj);
        if (result !== undefined) {
          return result;
        }
      } else {
        var mod = path.join(dir, file);
        try {
          return require(require.resolve(mod));
        } catch (ignored) {}
      }
    }
  }
}
module.exports = registerAutoloader;

function proxy(target, cb){
  return Proxy.create({
    getPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(null, target),
    getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(null, target),
    getOwnPropertyNames: Object.getOwnPropertyNames.bind(null, target),
    getPropertyNames: Object.getOwnPropertyNames.bind(null, target),
    keys: Object.keys.bind(null, target),
    defineProperty: Object.defineProperty.bind(null, target),
    set: function(r,k,v){ target[k] = v; return true },
    has: function(k){ return k in target },
    hasOwn: function(k){ return {}.hasOwnProperty.call(target, k) },
    delete: function(k){ delete target[k]; return true },
    enumerate: function(){ var i=0,k=[]; for (k[i++] in target); return k },
    get: function(r, key){
      if (key != 'v8debug' && target[key] == undefined) {
        return cb(key);
      }
    }
  }, Object.getPrototypeOf(target));
}

