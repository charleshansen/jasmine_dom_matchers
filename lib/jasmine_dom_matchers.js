/* Jasmine Dom Matchers

 The MIT License (MIT)

 Copyright (c) 2014 Charles Hansen

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */

(function() {
  'use strict';
  var jasmine = window.jasmine;
  beforeEach(function() {
    function isString(obj) {
      return obj.constructor === String;
    }

    function isFunction(obj) {
      return typeof obj === 'function'
    }

    function maybeStringify(obj) {
      return typeof obj !== 'boolean' && obj != undefined && isFunction(obj.toString) ? obj.toString() : obj;
    }

    function stringifyHtml(htmlCollection) {
      var string = Array.prototype.map.call(htmlCollection,function(node) {
        return node.outerHTML;
      }).join(", ");

      return '[ ' + string + ' ]';
    }

    function stringifyObject(obj) {
      var replacer = function(key, value) {return value instanceof RegExp ? value.toString(): value};
      return JSON.stringify(obj, replacer);
    }

    function prettify(obj) {
      if (isString(obj)) { return obj; }
      if ((obj instanceof HTMLElement) || (obj instanceof SVGSVGElement)) { return obj.outerHTML; }
      if (Array.isArray(obj)) { return stringifyObject(obj)}
      return stringifyHtml(obj);
    }

    function generateResults(pass, actualString, expected, verb, observed) {
      var particle = pass ? 'not to' : 'to';
      var messageArray = ['Expected', actualString, particle, verb, expected];
      if (!pass && typeof observed !== 'undefined') {
        messageArray = messageArray.concat('\n', 'but found', observed);
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
          compare: function() {
            var actual = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(makeHTMLArray(actual));
            args.push(actual);
            return compare.apply(null, args);
          }
        }
      }
    }

    function isVisible(el) {
      if (getComputedStyle(el)['visibility'] === 'hidden') { return false; }
      return ( el.offsetWidth > 0 || el.offsetHeight > 0 )
    }

    function match(expected, observed) {
      return (expected && isFunction(expected.test)) ? expected.test(observed) : maybeStringify(expected) === observed;
    }

    function hasClass(el, className) {
      if (el.classList) return el.classList.contains(className);
      var classRegEx = new RegExp('(^| )' + className + '( |$)', 'gi');
      if (el.className.animVal) return classRegEx.test(el.className.animVal);
      return classRegEx.test(el.className);
    }

    jasmine.addMatchers({
      toBeHidden: withSingleElement(function(actual, expected) {
        return generateResults(!isVisible(actual), prettify(actual), expected, 'be hidden');
      }),

      toBeVisible: withSingleElement(function(actual, expected) {
        return generateResults(isVisible(actual), prettify(actual), expected, 'be visible');
      }),

      toHaveAttr: withSingleElement(function(actual, attribute, expected, originalActual) {
        if(originalActual === undefined) { expected = undefined; } //DI quirk if expected is not given
        var observed = actual.getAttribute(attribute);
        var pass = false;
        if(expected !== undefined) {
          pass = match(expected, observed);
        } else {
          pass = observed !== null;
        }
        return generateResults(pass, prettify(actual), [attribute, '=', String(expected)].join(' '), 'have attribute', [attribute, '=', String(observed)].join(' '));
      }),

      toHaveProp: withSingleElement(function(actual, property, expected, originalActual) {
        if(originalActual === undefined) { expected = undefined; } //DI quirk if expected is not given
        var observed = actual[property];
        var pass = false;
        if(expected !== undefined) {
          pass = match(expected, observed);
        } else {
          pass = observed !== undefined;
        }
        return generateResults(pass, prettify(actual), [property, '=', String(expected)].join(' '), 'have property', [property, '=', String(observed)].join(' '));
      }),

      toHaveCss: withSingleElement(function(actual, expected) {
        var rules = Object.keys(expected);
        var observed = {};
        var pass = rules.every(function(rule) {
          var style = window.jQuery ? jQuery(actual).css(rule) : getComputedStyle(actual)[rule];
          observed[rule] = '' + style;
          return match(expected[rule], style);
        });
        return generateResults(pass, prettify(actual), stringifyObject(expected), 'have CSS', stringifyObject(observed));
      }),

      toHaveValue: withSingleElement(function(actual, expected) {
        var observed = actual.value;
        var pass = match(expected, observed);
        return generateResults(pass, prettify(actual), expected, 'have value', observed);
      }),

      toBeChecked: withSingleElement(function(actual) {
        return generateResults(actual.checked, prettify(actual), '', 'be checked');
      }),

      toBeFocused: withSingleElement(function(actual) {
        return generateResults(actual === document.activeElement, prettify(actual), '', 'be focused');
      }),

      toBeSelected: withSingleElement(function(actual) {
        return generateResults(actual.selected, prettify(actual), '', 'be selected');
      }),

      toBeDisabled: withSingleElement(function(actual) {
        return generateResults(actual.disabled, prettify(actual), '', 'be disabled');
      }),

      toHaveClass: withSingleElement(function(actual, expected) {
        var pass = (Array.isArray(expected) ? expected : Array(expected))
          .every(function(expectedClass) { return hasClass(actual, expectedClass) });
        return generateResults(pass, prettify(actual), expected, 'have class', actual.classList);
      }),

      toHaveText: withSingleElement(function(actual, expected) {
        var actualText = actual.textContent;
        var trimmedText = actualText && actualText.trim();
        var pass = false;
        if(expected && isFunction(expected.test)) {
          pass = expected.test(actualText) || expected.test(trimmedText);
        } else {
          pass = maybeStringify(expected) === actualText || maybeStringify(expected) === trimmedText;
        }
        return generateResults(pass, actual.innerHTML, expected, 'have text', actual.textContent);
      }),

      toContainText: withSingleElement(function(actual, expected) {
        var pass;
        if (expected.test instanceof Function) {
          pass = expected.test(actual.textContent);
        } else {
          pass = (actual.textContent).indexOf(maybeStringify(expected)) > -1;
        }
        return generateResults(pass, actual.innerHTML, expected, 'contain text', actual.textContent);
      }),

      toHaveLength: withHTMLArray(function(actual, expected, originalActual) {
        var pass = actual.length === expected;
        return generateResults(pass, prettify(originalActual), expected, 'have length', actual.length);
      }),

      toExist: withHTMLArray(function(actual, originalActual) {
        var pass = actual.length > 0;
        return generateResults(pass, prettify(originalActual), '', 'exist');
      })
    });
  });
})();
