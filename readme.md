## About
Autoloads JS files based on name when the class is needed.

This module removes the needs of using require() all over your files. Simply
define the autoloader to your codebase, and use the names relative to the files.

ie lib/Foo/Bar/Baz.js when you load 'lib/' makes Foo_Bar_Baz
require('./lib/Foo/Bar/Baz.js') automatically and return the value.

## 2.0 Requirements

2.0 Drastically changes how this project works. It now requires --harmony under Node 0.10, and the usage
 scenarios have completely changed. It now will replace underscores as seperators such as Foo_Bar instead
 of Foo.Bar.

 It also does not have to do any directory scanning and setting up tons of getters, simple Proxy on global catches unreferenced variables!

## Install

Install with npm install autoloader

## Usage

Run node with --harmony

Folder structure:

    /lib/
        Foo/
            Bar.js
        Foo.js
    test.js
    package.json (main: 'test.js')
    
File contents:

lib/Foo.js:

    module.export = function() {
        console.log("Foo")
        Foo_Bar();
    };

lib/Foo/Bar.js:

    module.export = function() {
        console.log("Foo_Bar")
    };


test.js:
    
    require('autoloader')(__dirname + '/lib')
    Foo();


Loading the module would print to screen:

    Foo
    Foo_Bar

You may optionally pass an object as the 2nd parameter and the autoloader will bind to that object instead of global.
So consider:

    global.App = require('autoloader')(__dirname + '/lib', require('./myapp'));
    new App.Foo_Bar();

## Custom Loaders
If you pass a function as the 1st argument, autoloader will execute that instead of
loading by directory, allowing you to control what is returned.
Callback signature

    function (name, object) { }

You will need to assign the value yourself if you wish to not have your loader fire every access.

## License
The MIT License

  Copyright (c) 2013 Daniel Ennis <aikar@aikar.co>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

