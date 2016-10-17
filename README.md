# kld-regex

A simple regular expression engine for ASCII text

## Compile regex to NFA Graph

```
let Regex = require('./lib/Regex');
let nfa_graph = new Regex().parse("(abc)+");
```

## Convert NFA Graph to DFA Graph

```
let NFAGraphConverter = require('./lib/NFAGraphConverter');
let runner = new NFAGraphConverter().convert(nfa_graph);
```


## Use DFA to match text

```
let source = "abcdefabc";
var offset = 0;

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
```

This will print:

```
Matches
=======
source = 'abcdefabc'
source[0:3] = abc
source[6:9] = abc
```

Admittedly, the API needs to be improved, but this is the first version that is somewhat complete.

## Supported operators

| Type                                  | Example   |
|---------------------------------------|-----------|
| Sequence:                             | abc       |
| Alternation:                          | a|b|c     |
| Grouping:                             | (ab)|(cd) |
| Repeat zero-or-more (Kleene closure): | \d*\.\d*  |
| Repeat one-or-more (Positive closure):| \d+\.\d+  |
| Optional:                             | (abc)?def |
| Character Classes:                    | [abc]     |
| Character Class Ranges:               | [a-c]     |
| Character Class Negation:             | [^abc]    |
| Empty Character Class:                | []        |
| Negated Empty Character Class:        | [^]       |
| Digit Character Class:                | \d        |
| Not-Digit Character Class:            | \D        |
| Whitespace Character Class:           | \s        |
| Not-Whitespace Character Class:       | \S        |
| Word Character Class:                 | \w        |
| Not-Word Character Class:             | \W        |
| Hex Character Values:                 | \x20      |