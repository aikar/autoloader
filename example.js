var autoload = require("./autoloader");
autoload(function(key, obj) {
  console.log("Trying to load " + key)
});
autoload(__dirname + '/test');
console.log(Foo_Bar, Foo_Baz);
