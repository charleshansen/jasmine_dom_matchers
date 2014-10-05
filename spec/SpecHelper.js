beforeEach(function() {
  var jasmineContent = document.querySelector('#jasmine-content');
  if(jasmineContent) {document.querySelector('body').removeChild(jasmineContent);}

  jasmineContent = document.createElement('div');
  jasmineContent.setAttribute('id', 'jasmine-content');
  document.querySelector('body').appendChild(jasmineContent);
});