A lightweight replacement for jasmine-jquery with just the matchers, with a focus on more useful error messages.
There are now also guards in place to make sure you are testing the element you think you are.
An expectation like
```javascript
expect('.foo').toHaveAttr('href', 'github.com');
```
will now fail if there are more than one element that match the selector.

As an added bonus, the jQuery dependency is optional. This will all work if you happen to have a website that uses native document manipulation.
jQuery is still used if available, to get access to the non-CSS jQuery selectors.

To use, copy [jasmine_dom_matchers.js](https://github.com/charleshansen/jasmine_dom_matchers/blob/master/lib/jasmine_dom_matchers.js) into your project and load it the same way you would load jasmine helpers.

Jasmine Dom Matchers is also published to npm, so `npm install jasmine_dom_matchers` also works. If you are using CommonJS, simply `require('jasmine_dom_matchers')` after jasmine has been loaded and everything should be hooked up.

Current Matchers Include:
  * toBeHidden
  * toBeVisible
  * toHaveAttr
  * toHaveProp
  * toHaveCss
  * toHaveValue
  * toBeChecked
  * toBeSelected
  * toBeFocused
  * toHaveClass
  * toHaveText
  * toContainText
  * toHaveLength
  * toExist
