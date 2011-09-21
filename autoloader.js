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

var getters = {};
var gettersIndex = [];
function defineGetter(obj, objpath, fn) {
  obj = obj || global
  var idx = gettersIndex.indexOf(obj);
  if (idx == -1) {
    idx = gettersIndex.push(obj)-1;
  }

  if (!getters[idx]) {
    getters[idx] = {};
  }
  var getp1 = getters[idx];
  var getp2 = getters[idx];
  
  var tmpobj = obj;
  objpath.forEach(function(val) {
    if (typeof getp1[val] != 'object' || !getp1[val].children) {
      getp1[val] = {
        children: {},
        create: function() {
          return {};
        }
      }
    }
    if (tmpobj) {
      if (typeof tmpobj == 'object' && tmpobj[val] == 'object') {
        tmpobj = tmpobj[val]
      } else {
        (function applyGetter(val, currentp, currentobj) {
          currentobj.__defineGetter__(val, function() {    
            delete currentobj[val];
            var ret = currentp.create(currentobj, val);
            // if the callback function set the var for us, don't overwrite it.
            if (currentobj[val] == undefined) {
              currentobj[val] = ret;
            }
            Object.keys(currentp.children).forEach(function(key) {
              applyGetter(key, currentp.children[key], currentobj[val]);
            });
            return currentobj[val];
          });
        })(val, getp1[val], tmpobj);
      }
    }
    getp2 = getp1[val];
    getp1 = getp1[val].children;
  });
  // tree built, set creation method...
  getp2.create = fn;
}


function getobjbykey(obj, key) {
  key.forEach(function(val) {
    if (typeof obj[val] == "object") {
      obj = obj[val]
    }
  });
  return obj
}
function registerAutoloader(filePath, cb, objpath, obj) {
  obj = obj || global;
  objpath = objpath && objpath.slice(0) || [];
  
  var files = fs.readdirSync(filePath);
  files.forEach(function(file) {
    var fullPath = filePath + '/' + file;
    var stat     = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      registerAutoloader(fullPath, cb, objpath.concat(file), obj);
    } else {
      var baseDirName = path.basename(filePath, '/');
      if (baseDirName == path.basename(file,'.js')) {
        autoload(obj, objpath, fullPath, cb)
      } else if (file == 'index.js') {
        autoload(obj, objpath, fullPath, cb)
      } else {
        var extLoc = file.lastIndexOf('.');
        if (extLoc != -1) {
          var ext = file.substr(extLoc);
          if (require.extensions[ext]) {
            autoload(obj, objpath.concat(path.basename(file,ext)), fullPath, cb)
          }
        }
      }
      
    }
  });
  return obj;
}
function autoload(obj, objpath, fullPath, cb) {
  //console.log("AUTOLOAD", objpath, fullPath)
  var load = function(obj, key) {
    var module = null;
    if (typeof cb == 'function') {
      module = cb(fullPath, objpath.join('.'), obj, key);
    }
    if (!module) {
      module = require(fullPath);
    }
    return module;
  }
  defineGetter(obj, objpath, load);
}

module.exports = registerAutoloader;
