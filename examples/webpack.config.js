const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const files = fs.readdirSync(__dirname)
.filter(name => !/webpack/.test(name))
.filter(name => /\.js$/.test(name))
.map(name => /^(.*)\.js$/.exec(name)[1]);

const entry = {};
files.forEach(name => {
  entry[name] = `./${name}`;
});

const html = files.map(name => new HtmlWebpackPlugin({
  filename: `${name}.html`,
  template: `${__dirname}/index.html`,
  chunks: [name],
}));

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  context: __dirname,
  entry,
  output: {
    path: `${__dirname}/../dist/examples`,
  },
  plugins: [
    ...html,
    new (require('webpack').DefinePlugin)({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      },
    }),
  ],
};
