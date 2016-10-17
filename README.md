# kld-regex

A simple regular expression engine for ASCII text.

## Compile Regex

```
let Regex = require('./lib/Regex');
let runner = Regex.parse("(abc)+");
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

console.log("source = '%s'", source);
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

| Type                                  | Example     |
|---------------------------------------|-------------|
| Sequence:                             | abc         |
| Alternation:                          | a|b|c       |
| Grouping:                             | (ab)|(cd)   |
| Repeat zero-or-more (Kleene closure): | \d\*\\.\d\* |
| Repeat one-or-more (Positive closure):| \d+\\.\d+   |
| Optional:                             | (abc)?def   |
| Character Classes:                    | [abc]       |
| Character Class Ranges:               | [a-c]       |
| Character Class Negation:             | [^abc]      |
| Empty Character Class:                | []          |
| Negated Empty Character Class:        | [^]         |
| Digit Character Class:                | \d          |
| Match all except \r and \n:           | .           |
| Not-Digit Character Class:            | \D          |
| Whitespace Character Class:           | \s          |
| Not-Whitespace Character Class:       | \S          |
| Word Character Class:                 | \w          |
| Not-Word Character Class:             | \W          |
| Hex Character Values:                 | \x20        |