var tester = require('../lib/tester');
var path = require('path');

jasmine.getEnv().defaultTimeoutInterval = 20000;
// process.env.DEBUG = true;

describe(__filename, function() {
  it('should create book and parse content', function(testDone) {
    tester.builder()
    .withContent('#test me \n\n![preview](preview.jpg)')
    .create()
    .then(function(result) {
      expect(result.get('index.html').content).toEqual('<h1 id="test-me">test me</h1>\n<p><img src="preview.jpg" alt="preview"></p>');
    })
    .fin(testDone)
    .done();
  });

  it('should create book with plugins and parse content', function(testDone) {
      tester.builder()
      .withContent('This text is {% em %}highlighted !{% endem %}')
      .withBookJson({"plugins": ["emphasize"]})
      .create()
      .then(function(result) {
        expect(result.get('index.html').content).toEqual('<p>This text is <span class="pg-emphasize pg-emphasize-yellow" style="">highlighted !</span></p>');
      })
      .fin(testDone)
      .done();
  });

  it('should add external resources and read them during build', function(testDone) {
      tester.builder()
      .withContent('This text is {% include "./includes/test.md" %}')
      .withFile('includes/test.md', 'included from an external file!')
      .create()
      .then(function(result) {
        expect(result.get('index.html').content).toEqual('<p>This text is included from an external file!</p>');
      })
      .fin(testDone)
      .done();
  });

  it('should add external second book page', function(testDone) {
      tester.builder()
      .withContent('First page content')
      .withPage('second', 'Second page content')
      .create()
      .then(function(result) {
        expect(result.get('index.html').content).toEqual('<p>First page content</p>');
        expect(result.get('second.html').content).toEqual('<p>Second page content</p>');
      })
      .fin(testDone)
      .done();
  });

  it('should create pages in a subdirectory', function(testDone) {
    tester.builder()
      .withPage('subdirectory/nested', 'This page is in the directory `subdirectory`.', 1)
      .withPage('subdirectory/also_nested', 'This page is also in the directory `subdirectory`.', 1)
      .create()
      .then(function(result) {
        expect(result.get('subdirectory/nested.html').content).toEqual('<p>This page is in the directory <code>subdirectory</code>.</p>');
        expect(result.get('subdirectory/also_nested.html').content).toEqual('<p>This page is also in the directory <code>subdirectory</code>.</p>');
      })
      .fin(testDone)
      .done();
  });

});
