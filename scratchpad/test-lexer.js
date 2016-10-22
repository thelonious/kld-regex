#!/usr/bin/env node

let Lexer = require('../lib/Lexer'),
    Table = require('kld-text-utils').Table,
    fs = require('fs');

// build token table
var tokens = [
    /*  0 */ { type: "whitespace",   pattern: "[\\ \\t]+" },
    /*  1 */ { type: "eol",          pattern: "(\\r\\n|\\r|\\n)"},
    /*  2 */ { type: "comment",      pattern: ";[^\\r\\n]*" },
    /*  3 */ { type: "mnemonic",     pattern: "(adc|and|asl|bcc|bcs|beq|bit|bmi|bne|bpl|brk|bvc|bvs|clc|cld|cli|clv|cmp|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jmp|jsr|lda|ldx|ldy|lsr|nop|ora|pha|php|pla|plp|rol|ror|rti|rts|sbc|sec|sed|sei|sta|stx|sty|tax|tay|tsx|txa|txs|tya)", caseSensitive: false },
    /*  4 */ { type: "directive",    pattern: "\\.(ascii|db|ds|dw|include|org)", caseSensitive: false },
    /*  5 */ { type: "equate",       pattern: "(\\.equ?|=)", caseSensitive: false },
    /*  6 */ { type: "lowByte",      pattern: "\\.l(ow)?", caseSensitive: false },
    /*  7 */ { type: "highByte",     pattern: "\\.h(igh)?", caseSensitive: false },
    /*  8 */ { type: "accumulator",  pattern: "a", caseSensitive: false },
    /*  9 */ { type: "register",     pattern: "(x|y)", caseSensitive: false },
    /* 10 */ { type: "colon",        pattern: ":" },
    /* 11 */ { type: "comma",        pattern: "," },
    /* 12 */ { type: "pound",        pattern: "#" },
    /* 13 */ { type: "lparen",       pattern: "\\(" },
    /* 14 */ { type: "rparen",       pattern: "\\)" },
    /* 15 */ { type: "charConstant", pattern: "'.'" },
    /* 16 */ { type: "charString",   pattern: "\\\"[^\"]+\\\"" },
    /* 17 */ { type: "binaryNumber", pattern: "%[01]+" },
    /* 18 */ { type: "hexNumber",    pattern: "\\$[a-f0-9]+", caseSensitive: false },
    /* 19 */ { type: "number",       pattern: "-?(0|[1-9][0-9]*)" },
    /* 20 */ { type: "plus",         pattern: "\\+" },
    /* 21 */ { type: "times",        pattern: "\\*" },
    /* 22 */ { type: "identifier",   pattern: "[a-z_][a-z0-9_]*", caseSensitive: false }
];

// build regex runner
let lexer = new Lexer();
let runner = lexer.compile(tokens);

console.log("let table = [");
runner.table.forEach(entry => {
    let transitions = entry[0];
    let acceptState = entry[1];

    console.log("  [ [%s], %s ],", transitions.join(","), acceptState);
});
console.log("];");

// load source file
let source = fs.readFileSync('divide.6502', { encoding: "utf8" });

// create table
let table = new Table();
table.headers = ["Type", "Start", "End", "Text"];

// add rows to table
runner.all(source).forEach(match => {
    if (match.type > 1) {
        table.addRow([
            tokens[match.type].type,
            match.startingOffset,
            match.endingOffset,
            match.text
        ]);
    }
});

// show the result
console.log(table.toString());
