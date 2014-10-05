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

  it('tests length', function() {
    expect($('<div>foo</div><div>bar</div>')).toHaveLength(2);
    expect($('<div>foo</div><div>bar</div>')).not.toHaveLength(3);
  });
});