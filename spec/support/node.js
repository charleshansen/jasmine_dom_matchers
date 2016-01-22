const memoize = require('lodash.memoize');
module.exports = {
  isNode: memoize(() => {
    if (typeof process === 'object') {
      if (typeof process.versions === 'object') {
        if (typeof process.versions.node !== 'undefined') {
          return true;
        }
      }
    }
    return false;
  })
};