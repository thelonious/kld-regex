# kld-regex

A simple regular expression engine (and lexer) for ASCII text.

## Compile Regex

```
let Regex = require('kld-regex').Regex;
let runner = Regex.compile("(abc)+");
```

## Get first match

```
var source = "abcdefabc";
var match = runner.next(source);

if (match !== null) {
	console.log(
		"source[%s:%s] = %s",
		match.startingOffset,
		match.endingOffset,
		match.text
	);
}
```

> `runner.next` has optional 2nd and 3rd arguments. The 2nd argument is the starting offset where the Regex should begin its match. The 3rd argument indicates where the match should stop.

## Get all matches

```
var source = "abcdefabc";
var matches = runner.all(source);

runner.all(source).forEach(match => {
	console.log(
		"source[%s:%s] = %s",
		match.startingOffset,
		match.endingOffset,
		match.text
	);
});
```

This will print:

```
Matches
=======
source = 'abcdefabc'
source[0:3] = abc
source[6:9] = abc
```

## Supported operators

| Type                                  | Example         |
|---------------------------------------|---------------- |
| Sequence:                             | abc             |
| Alternation:                          | a&#124;b&#124;c |
| Grouping:                             | (ab)|(cd)       |
| Repeat zero-or-more (Kleene closure): | \d\*\\.\d\*     |
| Repeat one-or-more (Positive closure):| \d+\\.\d+       |
| Optional:                             | (abc)?def       |
| Character Classes:                    | [abc]           |
| Character Class Ranges:               | [a-c]           |
| Character Class Negation:             | [^abc]          |
| Empty Character Class:                | []              |
| Negated Empty Character Class:        | [^]             |
| Match all except \r and \n:           | .               |
| Digit Character Class:                | \d              |
| Not-Digit Character Class:            | \D              |
| Whitespace Character Class:           | \s              |
| Not-Whitespace Character Class:       | \S              |
| Word Character Class:                 | \w              |
| Not-Word Character Class:             | \W              |
| Hex Character Values:                 | \x20            |


## Define a list of token types

Each token type should have the following properties:

- type: a string
- pattern: a kld-regex string pattern (regex)
- caseSensitive: an optional boolean (defaults to true)

```
var tokens = [
    /* 0 */ { type: "whitespace",   pattern: "\\s+" },
    /* 1 */ { type: "comment",      pattern: "#[^\\r\\n]*" },
    /* 2 */ { type: "identifier",   pattern: "[a-z_][a-z0-9_]*", caseSensitive: false }
];
```

## Build Lexer

```
let Lexer = require('kld-lexer').Lexer;
let lexer = new Lexer();
let runner = lexer.compile(tokens);
```

## Match against source

```
let source = fs.readFileSync('sample.txt', { encoding: "utf8" });

runner.all(source).forEach(match => {
	// skip whitespace, but show comments
	if (match.type > 0) {
		console.log(
			"%s: [%s,%s]: %s",
			tokens[match.type].type,
			match.startingOffset,
			match.endingOffset,
			match.text
		);
	}
});
```
