var vm = require('vm');
var path = require('path');
var fs = require('fs');
var format = require('util').format;
var escape = require('escape-html');
var CodeMirror = require('codemirror/addon/runmode/runmode.node.js');

module.exports = CodeMirror;

CodeMirror.loadMode = function (name) {
	var filename = require.resolve('codemirror/mode/' + name + '/' + name + '.js');
	var modeDef;

	try {
		modeDef = fs.readFileSync(filename, 'utf8');
	} catch (err) {
		throw new Error(name + " mode isn't shipped with CodeMirror");
	}

	vm.runInNewContext(modeDef, { CodeMirror: CodeMirror });
};

CodeMirror.highlight = function (string, options) {
	if (!options) options = {};

	var html = '';
	var col = 0;
	var tabSize = options.tabSize || 4

	CodeMirror.runMode(string, options.mode, function (text, style) {
		if (text === '\n') {
			html += '\n';
			col = 0;
			return;
		}

		var content = '';

		// replace tabs
		var pos = 0;
		while (true) {
			var idx = text.indexOf('\t', pos);
			if (idx === -1) {
				content += text.slice(pos);
				col += text.length - pos;
				break;
			} else {
				col += idx - pos;
				content += text.slice(pos, idx);
				var size = tabSize - col % tabSize;
				col += size;
				for (var i = 0; i < size; ++i) content += ' ';
				pos = idx + 1;
			}
		}

		content = escape(content);
		if (style) {
			var className = 'cm-' + style.replace(/ +/g, 'cm-');
			content = format('<span class="%s">%s</span>', className, content);
		}
		html += content;
	});

	return html;
};