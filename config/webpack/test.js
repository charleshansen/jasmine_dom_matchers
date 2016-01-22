const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');

module.exports = {
  devtool: 'eval',
  entry: null,
  externals: null,
  plugins: [
    new NormalModuleReplacementPlugin(/support\/window$/, f => {
      f.request = f.request.replace(/window/, 'window-browser');
    }),
    new DefinePlugin({'process.env': {'NODE_ENV': '"test"'}}),
    new NoErrorsPlugin()
  ],
  output: {
    filename: 'spec.js',
    pathInfo: true
  },
  quiet: true,
  watch: true
};