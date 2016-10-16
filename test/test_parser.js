let assert = require('assert'),
	Regex = require('../lib/Regex');

describe('Regex', function() {

	describe('single term', function() {
		var nfa = new Regex().parse("a");

		it("should not be null", function() {
			assert.notStrictEqual(nfa, null);
		});
	});

});
