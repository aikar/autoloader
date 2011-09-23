## About
Autoloads JS files based on name when the class is needed.
This is designed to be used with Joose classes in the "Foo.Bar.Baz" format

This module removes the needs of using require() all over your files. Simply
define the autoloader to your codebase, and use the names relative to the files.

ie lib/Foo/Bar/Baz.js when you load 'lib/' makes Foo.Bar.Baz
require('./lib/Foo/Bar/Baz.js') automatically and return the value.

## Install

Install with npm install autoloader

## Usage

Folder structure:

    /lib/
        Foo/
            Foo.js
            Bar.js
    test.js
    package.json (main: 'test.js')
    
File contents:

Foo.js:

    module.export = function() {
        console.log("Foo")
        Foo.Bar();
    };

Bar.js:

    module.export = function() {
        console.log("Foo.Bar")
    };


test.js:
    
    require('autoloader').autoload(__dirname + '/lib')
    Foo();


loading the module would print to screen:

    Foo
    Foo.Bar
    
ALL MODULES MUST RETURN AN OBJECT/FUNCTION. It can not return Scalar Values!

## Custom Loaders
If you pass a function as the 2nd argument, autoloader will execute that before
requiring the file with the following arguments:

    function (fullPath, className, object, key) { }
    
fullPath will be the full path to the module file to load, classname would
be 'Foo.Bar.Baz' for example, object would be the object to add a new value
to, and key is the key of object to assign the response.

so if you load 'Foo', object is global, and key is Foo, likewise if you load
Foo.Bar, object is Foo and key is 'Bar'.
You can then do what ever magic it is you need to do, and optionally assign it yourself.

If you don't assign it yourself, simply return the value and autoloader will
assign it for you.

## License
The MIT License

  Copyright (c) 2011 Daniel Ennis <aikar@aikar.co>

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

