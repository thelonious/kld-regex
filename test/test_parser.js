let assert = require('assert'),
	Regex = require('../lib/Regex');

function parse(text) {
	return new Regex().parse(text);
}

describe('Regex', function() {

	describe('single term is not null', function() {
		var nfa = parse("a");

		it("should not be null", function() {
			assert.notStrictEqual(nfa, null);
		});
	});

	describe('start anchor', function() {
		var nfa = parse("^a")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('end anchor', function() {
		var nfa = parse("a$")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('start and end anchor', function() {
		var nfa = parse("^a$")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('and-expression', function() {
		var nfa = parse("abc")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('or-expression', function() {
		var nfa = parse("a|b|c")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('and-expression with or-expression', function() {
		var nfa = parse("ab|cd|ef")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('empty character class', function() {
		var nfa = parse("[]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('negated empty character class', function() {
		var nfa = parse("[^]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('character class with range', function() {
		var nfa = parse("[a-z]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('character class with ranges', function() {
		var nfa = parse("[_a-zA-Z0-9]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('negated character class with range', function() {
		var nfa = parse("[^a-z]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('character class with range and leading hyphen', function() {
		var nfa = parse("[-a-z]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('character class with range and trailing hyphen', function() {
		var nfa = parse("[a-z-]")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('optional', function() {
		var nfa = parse("a?")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('positive closure', function() {
		var nfa = parse("a+")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('Kleene closure', function() {
		var nfa = parse("a*")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('group', function() {
		var nfa = parse("(abc)")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('group and-expression', function() {
		var nfa = parse("(abc)(def)")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('group or-expression', function() {
		var nfa = parse("(abc)|(def)")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('optional group', function() {
		var nfa = parse("(abc)?")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('group with positive closure', function() {
		var nfa = parse("(abc)+")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	describe('group with Kleene closure', function() {
		var nfa = parse("(abc)*")

		it("should parse", function() {
			assert.ok(true);
		});
	});

	// TODO: add special character classes
	// TODO: test wtih whitespace

});
