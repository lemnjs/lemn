const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const VERSIONS = ['0.4.0'];

if (
  process.env.npm_package_version &&
  !VERSIONS.includes(process.env.npm_package_version)
) {
  throw new Error('Current version must be represented in list of VERSIONS.');
}

const files = fs.readdirSync(__dirname)
.filter(name => !/webpack/.test(name))
.filter(name => /\.js$/.test(name))
.map(name => /^(.*)\.js$/.exec(name)[1])

module.exports = files.map(name => ({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'source-map',
  context: __dirname,
  entry: {[name]: `./${name}`},
  output: {
    path: `${__dirname}/../dist/examples`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
      terserOptions: {
        ecma: 8,
        mangle: {
          properties: {
            regex: /^lemnPrivate/,
          },
        },
      },
    })],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: `${__dirname}/index.html`,
      chunks: [name],
    }),
    new (require('webpack').DefinePlugin)({
      FILES: JSON.stringify(files),
      VERSIONS: JSON.stringify(VERSIONS),
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      },
    }),
    // Use a reduced bootstrap if there is only one module in the output chunk.
    new (require('../build/light-bootstrap-plugin'))(),
  ],
}));
