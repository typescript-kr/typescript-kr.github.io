var assert = require('assert');
var CodeMirror = require('..');

describe('codemirror-highlight', function () {
	it("should highlight javascript", function () {
		CodeMirror.loadMode('javascript');
		var html = CodeMirror.highlight('1', { mode: 'javascript'});

		assert.equal(html, '<span class="cm-number">1</span>');
	});

	it("should escape illegal characters", function () {
		CodeMirror.loadMode('javascript');
		var html = CodeMirror.highlight('1 < 2', { mode: 'javascript' });

		assert.equal(html, '<span class="cm-number">1</span> &lt; <span class="cm-number">2</span>');
	});
});