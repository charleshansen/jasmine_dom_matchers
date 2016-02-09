const DefinePlugin = require('webpack/lib/DefinePlugin');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');

module.exports = {
  externals: {
    jasmine: 'jasmine'
  },
  plugins: [
    new DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
    new NoErrorsPlugin()
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    pathinfo: false
  }
};