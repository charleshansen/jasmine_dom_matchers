module.exports = function(env) {
  const webpackConfig = require(`./webpack/${env}`);
  const config = {
    bail: false,
    entry: {
      jasmine_dom_matchers: './src/jasmine_dom_matchers.js'
    },
    module: {
      loaders: [
        {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    },
    stats: {
      colors: true
    }
  };
  return {...config, ...webpackConfig};
};