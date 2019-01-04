module.exports = class StdoutPlugin {
  apply (compiler) {
    compiler.hooks.afterCompile.tap('name', compilation => {
      if (Object.keys(compilation.assets).length === 0) {
        console.error('no assets');
        return;
      }
      const jsKeys = Object.keys(compilation.assets).filter(name => /\.js$/.test(name));
      if (jsKeys.length > 1) {
        console.error('too many assets');
        return;
      }
      // development module
      if (false && process.env.NODE_ENV === 'development') {
        console.log(Object.keys(compilation.assets['main.js']._source.children));
        console.log(compilation.assets['main.js']._source.children[12].source());
      }

      // production module
      // console.log(compilation.modules[0]._cachedSources.get('javascript').source._cachedSource);

      // full source, used in testing
      else {
        console.log(compilation.assets[jsKeys[0]].source());
      }
      delete compilation.assets[jsKeys[0]];
    });
  }
};
