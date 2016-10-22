#!/usr/bin/env node

let Regex = require('../lib/Regex');

let runner = Regex.compile("(abc)+");
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