/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
var ExtractTextPlugin = require('extract-text-webpack-plugin');

let libraryName = 'tourux';

let plugins = [],
  outputFile, outputCssFile;

if (env === 'prod') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
  outputCssFile = libraryName + '.min.css';
} else {
  outputFile = libraryName + '.js';
  outputCssFile = libraryName + '.css';
}

const extractLess = new ExtractTextPlugin({
  filename: outputCssFile
});
plugins.push(extractLess);

// plugins.push(new ExtractTextPlugin({
//   filename: '/dist/' + libraryName + '.css'
// }));

const config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [{
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }, {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|bower_components)/
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: env === 'prod',
            removeComments: false,
            collapseWhitespace: false
          }
        }],
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [{
            loader: "css-loader",
            options: { 'minimize': env === 'prod'}
          }, {
            loader: "less-loader",
            options: { 'minimize': env === 'prod'}
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins,
  externals: {
    'jquery': '$'
  }
};

module.exports = config;
