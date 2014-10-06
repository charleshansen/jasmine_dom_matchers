(function() {
  console.log('loading', window);

  var jasmine = window.jasmine;
  beforeEach(function() {
    function isString(obj) {
      return obj.constructor === String;
    }

    function stringifyHtml(htmlCollection) {
      var string = Array.prototype.map.call(htmlCollection,function(node) {
        return node.outerHTML;
      }).join(", ");

      return '[ ' + string + ' ]';
    }

    function prettify(obj) {
      if (isString(obj)) { return obj; }
      if (obj instanceof HTMLElement) { return obj.outerHTML; }
      return stringifyHtml(obj);
    }

    function generateResults(pass, actualString, expected, verb, observed) {
      var particle = pass ? 'not to' : 'to';
      var messageArray = ['Expected', actualString, particle, verb, expected];
      if (!pass && typeof observed !== 'undefined') {
        messageArray = messageArray.concat('but found', observed);
      }

      return {
        pass: pass,
        message: messageArray.join(' ')
      };
    }

    function makeHTMLArray(obj) {
      if (isString(obj)) {
        return window.jQuery ? jQuery(obj) : document.querySelectorAll(obj);
      }
      if (obj instanceof HTMLElement) {
        return Array(obj)
      } else {
        return obj;
      }
    }

    function makeHTMLElement(obj) {
      var arr = makeHTMLArray(obj);
      if (!(arr.length > 0)) { throw new Error('Attempting to make assertion on element that does not exist'); }
      if (arr.length > 1) { throw new Error('Attempting to make single element assertion on multiple elements'); }

      return arr[0];
    }

    function withSingleElement(compare) {
      return function() {
        return {
          compare: function() {
            var actual = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(makeHTMLElement(actual));
            args.push(actual);
            return compare.apply(null, args);
          }
        }
      }
    }

    function withHTMLArray(compare) {
      return function() {
        return {
          compare: function(actual, expected) {
            return compare(makeHTMLArray(actual), expected, actual);
          }
        }
      }
    }

    function isVisible(el) {
      if (getComputedStyle(el)['visibility'] === 'hidden') { return false; }
      return ( el.offsetWidth > 0 || el.offsetHeight > 0 )
    }

    jasmine.addMatchers({
      toBeHidden: withSingleElement(function(actual, expected) {
        return generateResults(!isVisible(actual), prettify(actual), expected, 'be hidden');
      }),

      toBeVisible: withSingleElement(function(actual, expected) {
        return generateResults(isVisible(actual), prettify(actual), expected, 'be visible');
      }),

      toHaveAttr: withSingleElement(function(actual, attribute, expected) {
        var observed = actual.getAttribute(attribute)
        var pass = observed === expected;
        return generateResults(pass, prettify(actual), [attribute, '=', expected].join(' '), 'have attribute', [attribute, '=', actual.getAttribute(attribute)].join(' '));
      }),

      toHaveClass: withSingleElement(function(actual, expected) {
        var pass = actual.classList.contains(expected);
        return generateResults(pass, prettify(actual), expected, 'have class', actual.classList);
      }),

      toHaveText: withSingleElement(function(actual, expected) {
        var pass = actual.textContent === expected;
        return generateResults(pass, actual.innerHTML, expected, 'have text', actual.textContent);
      }),

      toHaveLength: withHTMLArray(function(actual, expected, originalActual) {
        var pass = actual.length === expected;
        return generateResults(pass, prettify(originalActual), expected, 'have length', actual.length);
      }),

      toExist: withHTMLArray(function(actual, expected, originalActual) {
        var pass = actual.length > 0;
        return generateResults(pass, prettify(originalActual), expected, 'exist');
      })
    });
  });
})();
