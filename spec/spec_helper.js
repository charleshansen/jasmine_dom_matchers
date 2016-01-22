require('babel-polyfill');
const {isNode} = require('./support/node');

function browserOnly(tester) {
  return function(string, callback) {
    global[tester](string, function(...args) {
      if (isNode()) return pending();
      callback.call(this, ...args);
    });
  };
}

Object.assign(global, {
  itBrowserOnly: browserOnly('it'),
  fitBrowserOnly: browserOnly('fit')
});

beforeEach(done => {
  require('./support/window')(window => {
    Object.assign(global, require('./support/jquery')(window));
    done();
  });
});