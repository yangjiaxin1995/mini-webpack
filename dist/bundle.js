(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    const module = {
      exports: {},
    };

    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      'use strict';

      var _foo = require('./foo.js');

      (0, _foo.foo)();
      console.log('main.js');
    },
    { './foo.js': 1 },
  ],

  1: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.foo = foo;

      var _bar = require('./bar.js');

      var bar = _interopRequireWildcard(_bar);

      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key))
                newObj[key] = obj[key];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }

      function foo() {
        bar();
        console.log('foo.js');
      }
    },
    { './bar.js': 2 },
  ],

  2: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.bar = bar;

      function bar() {
        console.log('bar.js');
      }
    },
    {},
  ],
});
