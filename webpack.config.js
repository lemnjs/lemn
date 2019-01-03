module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    // devtool: 'inline-source-map',
    devtool: '',
    target: 'web',
    stats: process.env.WEBPACK_STDOUT ? 'none' : 'normal',
    entry: './index.js',
    output: {
        path: `${__dirname}/tmp/test`,
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: `shebang-loader`,
            },
        ],
    },
    plugins: [
        // new (require('webpack-visualizer-plugin'))(),
        new (require('webpack').DefinePlugin)({
            process: {
                env: {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                },
            },
        }),
        new (require('webpack').DllReferencePlugin)({
            context: __dirname,
            manifest: require('./tmp/test/dll.json'),
        }),
        process.env.WEBPACK_STDOUT ? {
            apply (compiler) {
                compiler.hooks.compilation.tap('name', compilation => {
                    compilation.mainTemplate.hooks.render.tap('name', (lastSource) => {
                        // return lastSource;
                        // console.log('a');
                        try {
                        const ConcatSource = require('webpack-sources/lib/ConcatSource');
                        const OriginalSource = require('webpack-sources/lib/OriginalSource');
                        const source = new ConcatSource();
                        source.add('(function ([factory]) {');
                        source.add(new OriginalSource([
                            'const __webpack_require__ = {r () {}, d (exports, name, getter) {Object.defineProperty(exports, {enumerable: false, get: getter});}};',
                            // 'const __webpack_require__ = function () {};',
                            // '__webpack_require__.r = __webpack_require__;',
                            // '__webpack_require__.d = function (exports, name, getter) {Object.defineProperty(exports, {enumerable: false, get: getter});};',
                            'const exports = {};',
                            'factory.call(exports, null, exports, __webpack_require__);',
                            'return exports;'
                        ].join('\n'), 'cheap bootstrap'));
                        source.add('})');
                        source.add('(');
                        // console.log();
                        // const modules = new ConcatSource();
                        lastSource.children.slice(5).forEach(s => source.add(s));
                        // source.add(modules);
                        // source.add(lastSource.children[5]);
                        // source.add(')');
                        // console.log('b');
                        // console.log(source.source());
                        return source;
                        } catch (e) {
                            console.error(e);
                        }
                    });
                    // compilation.mainTemplate.hooks.requireExtensions.tap('name', () => {
 //                        return [
 //                        '// define getter function for harmony exports',
 //                        '__webpack_require__.d = function(exports, name, getter) {',
 //                        '    if(!__webpack_require__.o(exports, name)) {',
 //                        '        Object.defineProperty(exports, name, { enumerable: true, get: getter });',
 //                        '    }',
 //                        '};',
 //                        '',
 //                        '// define __esModule on exports',
 //                        '__webpack_require__.r = function(exports) {',
 //                        '    if(typeof Symbol !== \'undefined\' && Symbol.toStringTag) {',
 //                        '        Object.defineProperty(exports, Symbol.toStringTag, { value: \'Module\' });',
 //                        '    }',
 //                        '    Object.defineProperty(exports, \'__esModule\', { value: true });',
 //                        '};',
 //                        '',
 //                        '// Object.prototype.hasOwnProperty.call',
 //                        '__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };',
 //                        ].join('\n');
 //                    });
                });
                compiler.hooks.afterCompile.tap('name', compilation => {
                    if (Object.keys(compilation.assets).length === 0) {
                        console.error('no assets');
                        return;
                    }
                    // development module
                    if (process.env.NODE_ENV === 'development') {
                       // console.log((compilation.assets['main.js']._source.children._source.children[12]);
                       console.log(compilation.assets['main.js']._source.children[12].source());
                    }

                    // production module
                    // console.log(compilation.modules[0]._cachedSources.get('javascript').source._cachedSource);

                    // full source, used in testing
                    else {
                        console.log(compilation.assets['main.js'].source());
                    }
                    Object.keys(compilation.assets).forEach(key => {
                        delete compilation.assets[key];
                    })
                });
            }
        } : null
    ].filter(Boolean),
};
