(function() {
  console.log('loading', window);

  var jasmine = window.jasmine;
  beforeEach(function () {
    function stringifyHtml(htmlCollection) {
      var string = Array.prototype.map.call( htmlCollection, function(node){
        return node.outerHTML;
      }).join(", ");

      return '[ ' + string + ' ]';
    }

    function generateResults(pass, actualString, expected, verb, observed) {
      var particle = pass ? 'not to' : 'to';
      var messageArray = ['Expected', actualString, particle, verb, expected];
      if(!pass && typeof observed !== 'undefined') { messageArray = messageArray.concat('but it was', observed);}

      return {
        pass: pass,
        message: messageArray.join(' ')
      };
    }

    function makeHTMLCollection(obj) {
      if(obj.constructor === String) {
        return document.querySelectorAll(obj);
      }
      if (obj instanceof HTMLElement) {
        return Array(obj)
      } else {
        return obj;
      }
    }

    function withSingleElement(compare) {
      return function() {
        return {
          compare: function(actual, expected) {
            return compare(makeHTMLCollection(actual), expected);
          }
        }
      }
    }

    jasmine.addMatchers({
      toHaveClass: withSingleElement(function(actual, expected) {
        var pass = actual[0].classList.contains(expected);
        return generateResults(pass, actual[0].outerHTML, expected, 'have class')
      }),

      toHaveText: function() {
        return {
          compare: function(actual, expected) {
            var pass = actual[0].textContent === expected;
            return generateResults(pass, actual[0].innerHTML, expected, 'have text')
          }
        }
      },

      toHaveLength: function() {
        return {
          compare: function(actual, expected) {
            var pass = actual.length === expected;
            return generateResults(pass, stringifyHtml(actual), expected, 'have length', actual.length)
          }
        }
      }
    });
  });
})();
