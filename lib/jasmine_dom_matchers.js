(function() {
  console.log('loading', window);

  var jasmine = window.jasmine;
  beforeEach(function() {
    function stringifyHtml(htmlCollection) {
      var string = Array.prototype.map.call(htmlCollection,function(node) {
        return node.outerHTML;
      }).join(", ");

      return '[ ' + string + ' ]';
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
      if (obj.constructor === String) {
        return document.querySelectorAll(obj);
      }
      if (obj instanceof HTMLElement) {
        return Array(obj)
      } else {
        return obj;
      }
    }

    function makeHTMLElement(obj) {
      var arr = makeHTMLArray(obj);
      if(!(arr.length > 0)) { throw new Error('Attempting to make assertion on element that does not exist'); }
      if(arr.length > 1) { throw new Error('Attempting to make single element assertion on multiple elements'); }

      return arr[0];
    }

    function withSingleElement(compare) {
      return function() {
        return {
          compare: function(actual, expected) {
            return compare(makeHTMLElement(actual), expected);
          }
        }
      }
    }

    jasmine.addMatchers({
      toHaveClass: withSingleElement(function(actual, expected) {
        var pass = actual.classList.contains(expected);
        return generateResults(pass, actual.outerHTML, expected, 'have class', actual.classList);
      }),

      toHaveText: withSingleElement(function(actual, expected) {
        var pass = actual.textContent === expected;
        return generateResults(pass, actual.innerHTML, expected, 'have text');
      }),

      toHaveLength: function() {
        return {
          compare: function(actual, expected) {
            var pass = actual.length === expected;
            return generateResults(pass, stringifyHtml(actual), expected, 'have length', actual.length);
          }
        }
      }
    });
  });
})();
