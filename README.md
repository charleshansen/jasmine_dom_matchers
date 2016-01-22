# Jasmine Dom Matchers

[![Build Status](https://travis-ci.org/charleshansen/jasmine_dom_matchers.svg?branch=master)](https://travis-ci.org/charleshansen/jasmine_dom_matchers)

A lightweight matching library for making assertions about html in Jasmine tests.
The matchers are designed to provide useful error messages on failure. They will also protect against some common falsely passing assertions.
The api is backwards compatible with matchers from [jasmine-jquery](https://github.com/velesin/jasmine-jquery) and can be used as a replacement. jQuery is not required.

##Installation

If you are using CommonJS and Webpack or Browserify, Jasmine Dom Matchers can be installed from npm
```sh
npm install jasmine_dom_matchers
```
Then, in your spec helper, add `require('jasmine_dom_matchers')`.

If you are serving up JavaScript otherwise, you can copy [jasmine_dom_matchers.js](https://github.com/charleshansen/jasmine_dom_matchers/blob/master/lib/jasmine_dom_matchers.js)
into your project and load it like as you would any Jasmine helper. Make sure to load it before you load your tests.

##Usage

A basic expectation looks like:

```javascript
expect('.foo').toHaveAttr('href', 'github.com');
```

This would assert that there is something on the page that matches the selector '.foo' and it has an `href` of 'github.com'.

#### Selectors

The argument to `expect` can be a selector ('.foo'), a jQuery object ($('.foo')), an HTMLElement (document.querySelector('.foo')),
or an HTMLCollection (document.querySelectorAll('.foo')).

The following examples are all the same if there is only one `.foo` (assuming you have jQuery on the page):
```javascript
expect('.foo').toHaveAttr('href', 'github.com');
expect($('.foo')).toHaveAttr('href', 'github.com');
expect(document.querySelector('.foo')).toHaveAttr('href', 'github.com');
expect(document.querySelectorAll('.foo')).toHaveAttr('href', 'github.com');
```

Jasmine Dom Matchers does not use jQuery by default. This means it does not use jQuery pseudo-selectors unless jQuery is available.
The following expectation will only work if jQuery is available.
```javascript
expect(':contains("foo")).toHaveAttr('href', 'github.com');
```

#### False passing protection

Jasmine Dom Matchers will automatically fail tests where the assertion is ambiguous, explained below:

There are a number of reasons a DOM matcher might fail. Take for example the expectation:

```javascript
expect('.foo').toHaveClass('bar');
```

This expectation could fail for a few reasons

1. There is an element that matchers '.foo' but it does not have the class 'bar'
2. There are multiple elements that match '.foo'. The first one does not have class 'bar', but the second one does.
3. There is no element that matches '.foo'

When the test was written, it was almost certainly checking for option 1. The other two options were probably not considered,
but can certainly happen due to unexpected bugs elsewhere in your code. The case with multiple selectors is especially ambiguous.

Now consider the reverse test

```javascript
expect('.foo').not.toHaveClass('bar');
```

Without protections, this test would pass in all of the cases where it would fail without the `not`. This means that it would pass if there
was no HTML on the page at all, or if some html with class 'foo' also had class 'bar', but some didn't.

To prevent these cases, almost all expectations will automatically fail if the selector fails to match any HTML. Additionally, most expectations will automatically
fail if a selector has more than one match. Exceptions are made for matchers like `toHaveLength` that are not ambiguous with multiple matches. This can require some
extra care when writing selectors for your tests, but is not intended to be a burden.

## Matchers

  * toBeChecked()
    - Checks if element has a `checked` property, only useful for checkbox inputs
  * toBeDisabled()
    - Checks if element has a `disabled` property
  * toBeFocused()
    - Checks if element is focused  
  * toBeHidden()
    - Checks if element has visibility 'hidden' or height or width = 0
    - the reverse of toBeVisible
  * toBeSelected()
    - Checks if element has a `selected` property, only useful for options
  * toBeVisible()
    - Checks if element has visibility style not 'hidden' and both height and width > 0
    - Reverse of toBeHidden
  * toContainText(text)
    - Checks if text substring is contained within element
    - text may be a number or RegExp
  * toExist()
    - True if the element exists, does not have to be in the DOM
  * toHaveAttr(attributeName, attributeValue)
    - checks element attributes
    - attributeValue is optional, if omitted, will check that the attribute exists
    - attributeValue can be a number, string or a RegExp
  * toHaveClass(className(String or Array of Strings))
    - Checks for presence of classes on the element.
    - If className is an Array, checks for all classes in the array.
  * toHaveCss(styles)
    - styles is an object, all styles given in that object will be checked
    - style values can get number or RegExp
    - e.g. `expect('.foo').toHaveCss({font-size: '16px', display: /block/})`
  * toHaveLength(length)
    - Checks for `length` number of html elements.
    - Also works for plain Arrays
  * toHaveProp(propertyName, propertyValue)
    - checks element properties
    - propertyValue is optional, if omitted, will check that the attribute exists
    - propertyValue can be a number, string or a RegExp  
  * toHaveText(text)
    - Checks for exact match with text, after trimming whitespace.
    - text may be a number or RegExp    
  * toHaveValue(value)
    - checks the `val` of eligible elements (like inputs)
    - value may be a number or RegExp  
 
## Development

To run tests headlessly:

```sh
npm install
gulp spec-browser
```

To run tests in browser:

```sh
npm install
gulp jasmine
```

Tests will be at http://localhost:8888

N.B.: Windows users will need to install python 2.x and visual studio before `npm install` due to the jsdom native extensions