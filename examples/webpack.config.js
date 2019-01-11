const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
