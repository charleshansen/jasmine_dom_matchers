describe("Matchers", function() {
  var $ = function(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    return element.children;
  };

  describe("matchers that expect a single element", function() {
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
        expect($('<div>foo</div><div>bar</div>')).toHaveClass('foo')
      }).toThrowError('Attempting to make single element assertion on multiple elements');
    });
  });

  describe("matchers that expect an element array", function() {
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
    it('matches visible elements are visible', function() {
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

  it('tests classes', function() {
    expect($('<div class="foo bar"></div>')).toHaveClass('foo');
    expect($('<div class="foo bar"></div>')).toHaveClass('bar');
    expect($('<div class="foo"></div>')).not.toHaveClass('bar');
    expect($('<div><div class="foo"></div></div>')).not.toHaveClass('foo');
  });

  describe("toHaveText", function() {
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
  });

  describe("toContainText", function() {
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
  });

  it('tests attributes', function() {
    expect($('<div foo="bar"></div>')).toHaveAttr('foo', 'bar');
    expect($('<div foo="bar"></div>')).not.toHaveAttr('foo', 'baz');
    expect($('<div foo="bar"></div>')).not.toHaveAttr('bar', 'baz');
  });

  describe("toHaveProp", function() {
    it('reads the property, not the attribute', function() {
      expect($('<input type="checkbox" checked="checked"/>')).toHaveProp('checked', true);
      expect($('<input type="checkbox" checked="checked"/>')).not.toHaveProp('checked', 'checked');
    });
  });

  it('tests values', function() {
    expect($('<input type="text" value="foo"/>')).toHaveValue('foo');
    expect($('<input type="text" value="foo"/>')).not.toHaveValue('bar');
  });

  it('tests checked', function() {
    expect($('<input type="checkbox" checked="checked">')).toBeChecked();
    expect($('<input type="checkbox">')).not.toBeChecked();
  });

  it('tests selected', function() {
    expect($('<option selected="selected">foo</option>')).toBeSelected();
    expect($('<option>foo</option>')).not.toBeSelected();
  });

  it('tests focus', function() {
    var focusedInput = $('<input class="focused" type="text">')[0];
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

  it('tests length', function() {
    expect($('<div>foo</div><div>bar</div>')).toHaveLength(2);
    expect($('<div>foo</div><div>bar</div>')).not.toHaveLength(3);
  });

  if(window.jQuery) {
    it('uses jQuery for selectors if available', function() {
      document.querySelector('#jasmine-content').appendChild($('<div class="foo">zebra</div>')[0]);
      expect('.foo:contains("zebra")').toHaveLength(1);
    });
  } else {
    xit('has jQuery fallbacks', function() {});
  }
});