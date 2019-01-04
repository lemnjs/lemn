module.exports = class LightBootstrapPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('name', compilation => {
      compilation.mainTemplate.hooks.render.tap('name', (lastSource, chunk) => {
        try {
          if (chunk.getNumberOfModules() === 1) {
            const ConcatSource = require('webpack-sources/lib/ConcatSource');
            const OriginalSource = require('webpack-sources/lib/OriginalSource');
            const source = new ConcatSource();
            source.add('(function ([factory]) {');
            source.add(new OriginalSource([
              // 'const __webpack_require__ = {r () {}, d (exports, name, getter) {Object.defineProperty(exports, {enumerable: false, get: getter});}};',
              'const __webpack_require__ = {r () {}, d (exports, name, getter) {exports[name] = getter;}};',
              'const exports = {};',
              'factory.call(exports, null, exports, __webpack_require__);',
              'for (const key in exports) {exports[key] = exports[key]();}',
              'return exports;'
            ].join('\n'), 'cheap bootstrap'));
            source.add('})');
            source.add('(');
            lastSource.children.slice(5).forEach(s => source.add(s));
            return source;
          }
        } catch (e) {
          console.error(e);
        }
      });
    });
  }
};
