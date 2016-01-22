const DefinePlugin = require('webpack/lib/DefinePlugin');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  externals: {
    jasmine: 'jasmine'
  },
  plugins: [
    new DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
    new NoErrorsPlugin(),
    new UglifyJsPlugin({compress: {warnings: false}})
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    pathinfo: false
  }
};