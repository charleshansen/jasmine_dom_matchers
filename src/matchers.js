function isString(obj) {
  return obj.constructor === String;
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function maybeStringify(obj) {
  return typeof obj !== 'boolean' && obj !== undefined && obj !== null && isFunction(obj.toString) ? obj.toString() : obj;
}

function stringifyHtml(htmlCollection) {
  const string = Array.prototype.map.call(htmlCollection, function(node) {
    return node.outerHTML;
  }).join(', ');

  return '[ ' + string + ' ]';
}

function stringifyObject(obj) {
  const replacer = function(key, value) {
    return value instanceof RegExp ? value.toString() : value;
  };
  return JSON.stringify(obj, replacer);
}

function prettify(obj) {
  if (isString(obj)) {
    return obj;
  }
  if ('outerHTML' in obj) {
    return obj.outerHTML;
  }
  if (Array.isArray(obj)) {
    return stringifyObject(obj);
  }
  return stringifyHtml(obj);
}

function generateResults(pass, actualString, expected, verb, observed) {
  const particle = pass ? 'not to' : 'to';
  let messageArray = ['Expected', actualString, particle, verb, expected];
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
  if ('innerHTML' in obj) {
    return Array(obj);
  }
  return obj;
}

function makeHTMLElement(obj) {
  const arr = makeHTMLArray(obj);
  if (!(arr.length > 0)) {
    throw new Error('Attempting to make assertion on element that does not exist');
  }
  if (arr.length > 1) {
    throw new Error('Attempting to make single element assertion on multiple elements');
  }

  return arr[0];
}

function withSingleElement(compare) {
  return function() {
    return {
      compare: function() {
        const actual = arguments[0];
        const args = Array.prototype.slice.call(arguments, 1);
        args.unshift(makeHTMLElement(actual));
        args.push(actual);
        return compare.apply(null, args);
      }
    };
  };
}

function withHTMLArray(compare) {
  return function() {
    return {
      compare: function() {
        const actual = arguments[0];
        const args = Array.prototype.slice.call(arguments, 1);
        args.unshift(makeHTMLArray(actual));
        args.push(actual);
        return compare.apply(null, args);
      }
    };
  };
}

function isVisible(el) {
  if (getComputedStyle(el).visibility === 'hidden') {
    return false;
  }
  return ( el.offsetWidth > 0 || el.offsetHeight > 0 );
}

function match(expected, observed) {
  return (expected && isFunction(expected.test)) ? expected.test(observed) : maybeStringify(expected) === observed;
}

function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  const classRegEx = new RegExp('(^| )' + className + '( |$)', 'gi');
  if (el.className.animVal) return classRegEx.test(el.className.animVal);
  return classRegEx.test(el.className);
}

module.exports = {
  toBeHidden: withSingleElement(function(actual, expected) {
    return generateResults(!isVisible(actual), prettify(actual), expected, 'be hidden');
  }),

  toBeVisible: withSingleElement(function(actual, expected) {
    return generateResults(isVisible(actual), prettify(actual), expected, 'be visible');
  }),

  toHaveAttr: withSingleElement(function(actual, attribute, expected, originalActual) {
    if (originalActual === undefined) {
      expected = undefined;
    } //DI quirk if expected is not given
    const observed = actual.getAttribute(attribute);
    let pass = false;
    if (expected !== undefined) {
      pass = match(expected, observed);
    } else {
      pass = observed !== null;
    }
    return generateResults(pass, prettify(actual), [attribute, '=', String(expected)].join(' '), 'have attribute', [attribute, '=', String(observed)].join(' '));
  }),

  toHaveProp: withSingleElement(function(actual, property, expected, originalActual) {
    if (originalActual === undefined) {
      expected = undefined;
    } //DI quirk if expected is not given
    const observed = actual[property];
    let pass = false;
    if (expected !== undefined) {
      pass = match(expected, observed);
    } else {
      pass = observed !== undefined;
    }
    return generateResults(pass, prettify(actual), [property, '=', String(expected)].join(' '), 'have property', [property, '=', String(observed)].join(' '));
  }),

  toHaveCss: withSingleElement(function(actual, expected) {
    const rules = Object.keys(expected);
    const observed = {};
    const pass = rules.every(function(rule) {
      const style = window.jQuery ? jQuery(actual).css(rule) : getComputedStyle(actual)[rule];
      observed[rule] = '' + style;
      return match(expected[rule], style);
    });
    return generateResults(pass, prettify(actual), stringifyObject(expected), 'have CSS', stringifyObject(observed));
  }),

  toHaveValue: withSingleElement(function(actual, expected) {
    const observed = actual.value;
    const pass = match(expected, observed);
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
    const pass = (Array.isArray(expected) ? expected : Array(expected))
      .every(function(expectedClass) {
        return hasClass(actual, expectedClass);
      });
    return generateResults(pass, prettify(actual), expected, 'have class', actual.classList);
  }),

  toHaveText: withSingleElement(function(actual, expected) {
    const actualText = actual.textContent;
    const trimmedText = actualText && actualText.trim();
    let pass = false;
    if (expected && isFunction(expected.test)) {
      pass = expected.test(actualText) || expected.test(trimmedText);
    } else {
      pass = maybeStringify(expected) === actualText || maybeStringify(expected) === trimmedText;
    }
    return generateResults(pass, actual.innerHTML, expected, 'have text', actual.textContent);
  }),

  toContainText: withSingleElement(function(actual, expected) {
    let pass;
    if (expected.test instanceof Function) {
      pass = expected.test(actual.textContent);
    } else {
      pass = (actual.textContent).indexOf(maybeStringify(expected)) > -1;
    }
    return generateResults(pass, actual.innerHTML, expected, 'contain text', actual.textContent);
  }),

  toHaveLength: withHTMLArray(function(actual, expected, originalActual) {
    const pass = actual.length === expected;
    return generateResults(pass, prettify(originalActual), expected, 'have length', actual.length);
  }),

  toExist: withHTMLArray(function(actual, originalActual) {
    const pass = actual.length > 0;
    return generateResults(pass, prettify(originalActual), '', 'exist');
  })
};
