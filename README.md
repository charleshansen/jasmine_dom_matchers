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

Current Matchers Include:
  * toBeHidden
  * toBeVisible
  * toHaveAttr
  * toHaveProp
  * toHaveValue
  * toBeChecked
  * toBeSelected
  * toHaveClass
  * toHaveText
  * toContainText
  * toHaveLength
  * toExist
