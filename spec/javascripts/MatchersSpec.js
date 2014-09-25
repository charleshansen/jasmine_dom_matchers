describe("Matchers", function() {
  var $ = function(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    return element.children;
  };

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