module.exports = {
    mode: 'development',
    stats: 'none',
    entry: ['tape'],
    output: {
        path: `${__dirname}/../tmp/test`,
        filename: 'dll.js',
        library: 'dll_tape',
        libraryTarget: 'var',
    },
    externals: {
        fs: '{}',
    },
    plugins: [
        new (require('webpack').DllPlugin)({
            name: 'dll_tape',
            path: `${__dirname}/../tmp/test/dll.json`,
        }),
    ],
};
