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
  plugins: [
    new DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      },
    }),
    process.env.NODE_ENV === 'test' ? new DllReferencePlugin({
      context: `${__dirname}/..`,
      manifest: require('../tmp/test/dll.json'),
    }) : null,
    ...(process.env.WEBPACK_STDOUT ? [
      new LightBootstrapPlugin(),
      new StdoutPlugin(),
    ] : []),
  ].filter(Boolean),
};
