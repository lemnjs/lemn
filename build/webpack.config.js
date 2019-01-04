const {DefinePlugin, DllReferencePlugin} = require('webpack');

const LightBootstrapPlugin = require('./light-bootstrap-plugin');
const StdoutPlugin = require('./stdout-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'development' ? '' : 'source-map',
  target: 'web',
  stats: process.env.WEBPACK_STDOUT ? 'none' : 'normal',
  context: `${__dirname}/..`,
  entry: './index.js',
  output: {
    path: `${__dirname}/../dist`,
    filename: 'web.js',
  },
  externals: {
      fs: '{}',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: ['istanbul'],
          presets: ['@babel/preset-env'],
        }
      }
    ],
  },
  plugins: [
    // new DefinePlugin({
    //   process: {
    //     env: {
    //       NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    //     },
    //     nextTick: '(function (fn) {setImmediate(fn);})',
    //     version: JSON.stringify(process.version),
    //   },
    // }),
    process.env.WEBPACK_USE_TEST_DLL ? new DllReferencePlugin({
      context: `${__dirname}/..`,
      manifest: require('../tmp/test/dll.json'),
    }) : null,
    ...(process.env.WEBPACK_STDOUT ? [
      new LightBootstrapPlugin(),
      new StdoutPlugin(),
    ] : []),
  ].filter(Boolean),
};
