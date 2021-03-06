require('./spec_helper');

describe('Matchers', function() {
  beforeEach(() => {
    jasmine.addMatchers(require('../src/matchers'));
  });

  function itWorks() {
    describe('matchers that expect a single element', function() {
      it('works when given a collection with one element', function() {
        expect($('<div class="foo"></div>')).toHaveClass('foo');
      });

      it('works when given a single html element', function() {
        expect($('<div class="foo"></div>')[0]).toHaveClass('foo');
      });

      it('works when given a selector', function() {
        document.querySelector('#jasmine-content').appendChild($('<div class="foo"></div>')[0]);
        expect('.foo').toHaveClass('foo');
      });

      it('raises an error if no element is found', function() {
        expect(function() {
          expect('.foo').toHaveClass('foo');
        }).toThrowError('Attempting to make assertion on element that does not exist');
      });

      it('raises an error if more than one element is found', function() {
        expect(function() {
          expect($('<div>foo</div><div>bar</div>')).toHaveClass('foo');
        }).toThrowError('Attempting to make single element assertion on multiple elements');
      });
    });

    describe('matchers that expect an element array', function() {
      it('works when given a collection with one element', function() {
        expect($('<div class="foo"></div>')).toHaveLength(1);
      });

      it('works when given a single html element', function() {
        expect($('<div class="foo"></div>')[0]).toHaveLength(1);
      });

      it('works when given a selector', function() {
        document.querySelector('#jasmine-content').appendChild($('<div class="foo"></div>')[0]);
        document.querySelector('#jasmine-content').appendChild($('<div class="foo"></div>')[0]);
        expect('.foo').toHaveLength(2);
      });

      it('does not throw if the element does not exist', function() {
        expect('#does-not-exist').toHaveLength(0);
      });
    });

    describe('visibility', function() {
      itBrowserOnly('matches visible elements are visible', function() {
        document.querySelector('#jasmine-content').appendChild($('<div class="foo"></div>')[0]);
        expect('.foo').toBeVisible();
        expect('.foo').not.toBeHidden();
      });

      it('matches display: none; elements as hidden', function() {
        document.querySelector('#jasmine-content').appendChild($('<div class="bar" style="display: none;"></div>')[0]);
        expect('.bar').not.toBeVisible();
        expect('.bar').toBeHidden();
      });

      it('matches visibility: hidden; elements as hidden', function() {
        document.querySelector('#jasmine-content').appendChild($('<div class="baz" style="visibility: hidden;"></div>')[0]);
        expect('.baz').not.toBeVisible();
        expect('.baz').toBeHidden();
      });

      it('matches hidden inputs as hidden', function() {
        document.querySelector('#jasmine-content').appendChild($('<input type="hidden"></div>')[0]);
        expect('input[type="hidden"]').not.toBeVisible();
        expect('input[type="hidden"]').toBeHidden();
      });

      it('matches elements with no size as hidden', function() {
        document.querySelector('#jasmine-content').appendChild($('<div class="empty" style="width: 0; height: 0;"></div>')[0]);
        expect('.empty').not.toBeVisible();
        expect('.empty').toBeHidden();
      });
    });

    describe('toHaveClass', function() {
      it('tests classes when given a single class', function() {
        expect($('<div class="foo bar"></div>')).toHaveClass('foo');
        expect($('<div class="foo bar"></div>')).toHaveClass('bar');
        expect($('<div class="foo"></div>')).not.toHaveClass('bar');
        expect($('<div><div class="foo"></div></div>')).not.toHaveClass('foo');
      });

      it('works with arrays', function() {
        expect($('<div class="foo bar baz"></div>')).toHaveClass(['foo', 'bar']);
        expect($('<div class="foo bar"></div>')).not.toHaveClass(['foo', 'zebra']);
        expect($('<div></div>')).not.toHaveClass(['foo']);
      });

      it('works with svg', function() {
        expect($('<svg class="foo bar"></svg>')).toHaveClass('foo');
        expect($('<svg class="foo bar"></svg>')).not.toHaveClass('baz');
      });
    });

    describe('toHaveText', function() {
      it('matches text exactly', function() {
        expect($('<div>foo</div>')).toHaveText('foo');
        expect($('<div><span>foo</span><p></p></div>')).toHaveText('foo');
        expect($('<div>foo</div>')).not.toHaveText('fo');
        expect($('<div>foo</div>')).not.toHaveText('bar');
      });

      it('ignores whitespace', function() {
        expect($('<div> foo </div>')).toHaveText('foo');
      });

      it('handles regex', function() {
        expect($('<div>foo</div>')).toHaveText(/o{2}/);
      });

      it('handles numbers', function() {
        expect($('<div>42</div>')).toHaveText(42);
        expect($('<div>42</div>')).not.toHaveText(4);
      });
    });

    describe('toContainText', function() {
      it('matches strings', function() {
        expect($('<div>foo</div>')).toContainText('foo');
        expect($('<div>foo</div>')).toContainText('oo');
        expect($('<div>foo</div>')).not.toContainText('oof');
      });

      it('matches regex', function() {
        expect($('<div>foo</div>')).toContainText(/foo/);
        expect($('<div>foo</div>')).toContainText(/o{2}/);
        expect($('<div>foo</div>')).not.toContainText(/o{3}/);
      });

      it('matches numbers', function() {
        expect($('<div>42</div>')).toContainText(4);
        expect($('<div>42</div>')).not.toContainText(423);
      });
    });

    describe('toHaveAttr', function() {
      it('tests attribute values if given one', function() {
        expect($('<div foo="bar"></div>')).toHaveAttr('foo', 'bar');
        expect($('<div foo="bar"></div>')).not.toHaveAttr('foo', 'baz');
        expect($('<div foo="bar"></div>')).not.toHaveAttr('bar', 'baz');
      });

      it('tests the attribute exists at all if not given a value', function() {
        expect($('<div foo="bar"></div>')).toHaveAttr('foo');
        expect($('<div foo="bar"></div>')).not.toHaveAttr('bar');
      });

      it('uses a regex if given one', function() {
        expect($('<div foo="bar"></div>')).toHaveAttr('foo', /^ba/);
        expect($('<div foo="bar"></div>')).not.toHaveAttr('bar', /ba$/);
      });

      it('stringifies the expectations if applicable', function() {
        expect($('<div foo="2"></div>')).toHaveAttr('foo', 2);
        expect($('<div foo="2"></div>')).not.toHaveAttr('foo', 3);
      });
    });

    describe('toHaveProp', function() {
      it('reads the property, not the attribute', function() {
        expect($('<input type="checkbox" checked="checked"/>')).toHaveProp('checked', true);
        expect($('<input type="checkbox" checked="checked"/>')).not.toHaveProp('checked', 'checked');
      });

      it('tests the property exists at all if not given a value', function() {
        expect($('<input type="checkbox" checked="checked"/>')).toHaveProp('checked');
        expect($('<input type="checkbox" checked="checked"/>')).not.toHaveProp('defaultSelected');
      });

      it('uses a regex if given one', function() {
        expect($('<input type="checkbox"/>')).toHaveProp('tagName', /^in/i);
        expect($('<input type="checkbox"/>')).not.toHaveProp('tagName', /^div/);
      });
    });

    describe('toHaveCss', function() {
      beforeEach(function() {
        document.querySelector('#jasmine-content')
          .appendChild($('<div class="foo" style="font-size: 16px; display: inline-block;"></div>')[0]);
      });
      it('passes if the css matches', function() {
        expect('.foo').toHaveCss({'font-size': '16px', display: 'inline-block'});
      });

      it('fails if the any css does not match', function() {
        expect('.foo').not.toHaveCss({'font-size': '24px', display: 'inline-block'});
      });

      it('uses regex if given one', function() {
        expect('.foo').toHaveCss({'font-size': /16/, display: 'inline-block'});
        expect('.foo').not.toHaveCss({'font-size': /24/, display: 'inline-block'});
      });
    });

    describe('toHaveValue', function() {
      it('tests values', function() {
        expect($('<input type="text" value="foo"/>')).toHaveValue('foo');
        expect($('<input type="text" value="foo"/>')).not.toHaveValue('bar');
      });

      it('tests values with regex if given one', function() {
        expect($('<input type="text" value="foo"/>')).toHaveValue(/oo/);
        expect($('<input type="text" value="foo"/>')).not.toHaveValue(/^oo/);
      });

      it('does not crash if given undefined or null', function() {
        expect($('<input type="text" value="foo"/>')).not.toHaveValue(undefined);
        expect($('<input type="text" value="foo"/>')).not.toHaveValue(null);
        expect($('<input type="text" value="0"/>')).toHaveValue(0);
      });
    });

    it('tests checked', function() {
      expect($('<input type="checkbox" checked="checked">')).toBeChecked();
      expect($('<input type="checkbox">')).not.toBeChecked();
    });

    it('tests selected', function() {
      expect($('<option selected="selected">foo</option>')).toBeSelected();
      expect($('<option>foo</option>')).not.toBeSelected();
    });

    it('tests disabled', function() {
      expect($('<option disabled="disabled">foo</option>')).toBeDisabled();
      expect($('<option disabled>foo</option>')).toBeDisabled();
      expect($('<option>foo</option>')).not.toBeDisabled();
    });

    it('tests focus', function() {
      const focusedInput = $('<input class="focused" type="text">')[0];
      document.querySelector('#jasmine-content').appendChild(focusedInput);
      document.querySelector('#jasmine-content').appendChild($('<input class="blurred" type="text">')[0]);
      focusedInput.focus();
      expect('.focused').toBeFocused();
      expect('.blurred').not.toBeFocused();
    });

    it('tests existence', function() {
      expect($('<div>foo</div>')).toExist();
      expect('#does-not-exist').not.toExist();
      document.querySelector('#jasmine-content').appendChild($('<div class="foo"></div>')[0]);
      expect('.foo').toExist();
    });

    describe('toHaveLength', function() {
      it('works on html collections', function() {
        expect($('<div>foo</div><div>bar</div>')).toHaveLength(2);
        expect($('<div>foo</div><div>bar</div>')).not.toHaveLength(3);
      });

      it('works on arrays', function() {
        expect([1, 2, 3]).toHaveLength(3);
        expect([1, 2, 3]).not.toHaveLength(4);
      });
    });
  }

  describe('when jQuery is loaded', function() {
    itWorks();

    it('uses jQuery for selectors', function() {
      document.querySelector('#jasmine-content').appendChild($('<div class="foo">zebra</div>')[0]);
      expect('.foo:contains("zebra")').toHaveLength(1);
    });
  });
  describe('when jQuery is not loaded', function() {
    beforeEach(function() {
      window._jQuery = window.jQuery;
      delete window.jQuery;
    });
    afterEach(function() {
      window.jQuery = window._jQuery;
    });

    itWorks();
  });
});