module.exports = window => {
  const {getComputedStyle, $ = require('jquery')} = window;
  const [root] = $('body').find('#jasmine-content').remove().end().append('<main id="jasmine-content"/>').find('#root');
  return {$, jQuery: $, root, window, getComputedStyle};
};