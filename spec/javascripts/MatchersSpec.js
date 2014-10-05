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

  it('tests classes', function() {
    expect($('<div class="foo bar"></div>')).toHaveClass('foo');
    expect($('<div class="foo bar"></div>')).toHaveClass('bar');
    expect($('<div class="foo"></div>')).not.toHaveClass('bar');
    expect($('<div><div class="foo"></div></div>')).not.toHaveClass('foo');
  });

  it('matches text', function() {
    expect($('<div>foo</div>')).toHaveText('foo');
    expect($('<div><span>foo</span><p></p></div>')).toHaveText('foo');
    expect($('<div>foo</div>')).not.toHaveText('fo');
    expect($('<div>foo</div>')).not.toHaveText('bar');
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
});