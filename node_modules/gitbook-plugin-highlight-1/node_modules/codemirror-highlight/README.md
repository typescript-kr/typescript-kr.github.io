# codemirror-highlight

Generating HTML containing highlighted code with CodeMirror

## Installation

	npm install codemirror-highlight

## Example

```javascript
var assert = require('assert');
var CodeMirror = require('codemirror-highlight');

CodeMirror.loadMode('javascript');
var html = CodeMirror.highlight('1', { mode: 'javascript' });

assert.equal(html, '<span class="cm-number">1</span>');
```

## API

### CodeMirror.loadMode(mode)

* `mode` - a string containing the mode name

Load `mode` shipped with CodeMirror. A list of modes can be found [here](https://github.com/marijnh/CodeMirror/tree/master/mode).


### CodeMirror.highlight(code, options)

* `code` - a string of code to be highlighted
* `options` - an object literal supporting these options:
	* `mode` - the same as the mode `option` you should pass to vanilla CodeMirror
	* `tabSize` - the width of a tab character. Defaults to 4.

Return the HTML containing highlighted code