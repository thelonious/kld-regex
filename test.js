#!/usr/bin/env node

let Regex = require('./lib/Regex'),
	Table = require("kld-text-utils").Table;

// parser.ignoreWhitespace = false;
let compiler = new Regex();
let runner = compiler.parse("(abc)+");

if (runner !== null) {
	console.log("NFA Nodes");
	console.log("=========");
	console.log(compiler.nfa_graph.toString());

	var table = new Table();
	table.headers = ["ID", "NFAs", "Accept"];
	console.log();
	console.log("DFA Nodes");
	console.log("=========");
	compiler.dfa_graph.forEach((node, index) => {
		table.addRow([index, node, node.acceptState]);
	});
	console.log(table.toString());

	console.log();
	console.log("Table");
	console.log("=====");
	console.log("let table = [");
	runner.table.forEach(entry => {
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
			offset++;
		}
	} while (offset < source.length);
}
else {
	console.log(null);
}
