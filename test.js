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
	var matches = runner.all(source);

	console.log("source = '%s'", source);
	runner.all(source).forEach(match => {
		console.log(
			"source[%s:%s] = %s",
			match.startingOffset,
			match.endingOffset,
			match.text
		);
	});
}
else {
	console.log(null);
}
