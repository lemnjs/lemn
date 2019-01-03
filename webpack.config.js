module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    // devtool: 'inline-source-map',
    devtool: '',
    target: 'web',
    stats: process.env.WEBPACK_STDOUT ? 'none' : 'normal',
    entry: 'shebang-loader!./index.js',
    output: {
        path: `${__dirname}/tmp/test`,
        filename: 'main.js',
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
                compiler.hooks.afterCompile.tap('name', compilation => {
                    // development module
                    if (process.env.NODE_ENV === 'development') {
                        console.log(compilation.assets['main.js']._source.children[12].source());
                    }

                    // production module
                    // console.log(compilation.modules[0]._cachedSources.get('javascript').source._cachedSource);

                    // full source, used in testing
                    if (process.env.NODE_ENV === 'test') {
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
