module.exports = callback => {
  require('jsdom').jQueryify(window, require.resolve('jquery'), () => callback(window));
};
