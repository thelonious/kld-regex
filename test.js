#!/usr/bin/env node

let Regex = require('./lib/Regex'),
	parser = new Regex(),
	NFAGraphConverter = require('./lib/NFAGraphConverter'),
	converter = new NFAGraphConverter();

// parser.ignoreWhitespace = false;
let pattern = parser.parse("(abc)+");

if (pattern !== null) {
	pattern.index();
	console.log(pattern.toString());

	var runner = converter.convert(pattern);

	var table = runner.table;
	var dfa_nodes = converter.dfa_nodes;
	console.log();
	console.log("DFA Nodes");
	console.log("=========");
	dfa_nodes.forEach((node, index) => {
		console.log("%s: %s: %s", index, node, node.acceptState);
	});

	console.log();
	console.log("Table");
	console.log("=====");
	console.log("let table = [");
	table.forEach(entry => {
		let transitions = entry[0];
		let acceptState = entry[1];

		console.log("  [ [%s], %s ],", transitions.join(","), acceptState);
	});
	console.log("];");

	console.log();
	console.log("Matches");
	console.log("=======");

	var source = "abcdefabc";
	var offset = 0;

	console.log("source = '%s'", source);

	do {
		var result = runner.next(source, offset, source.length);

		if (result.acceptState != -1) {
			var text = source.substring(result.startingOffset, result.endingOffset);

			console.log("source[%s:%s] = %s", result.startingOffset, result.endingOffset, text);

			offset = result.endingOffset;
		}
		else {
			offset = result.startingOffset + 1;
		}
	} while (offset < source.length);
}
else {
	console.log(null);
}
