let CharacterClassInput = require('./CharacterClassInput'),
    NFAGraph = require('./NFAGraph');

class Regex {
	constructor() {
		this.source = "";
		this.sourceLength = 0;
		this.caseSensitive = false;
		this.accept = 0;
		this.index = 0;
		this.stack = [];
	}

    static join(nfas) {
        var graph = new NGAGraph();
        var result = graph.start;

        for (var i = 0; i < nfas.length; i++) {
            result.addEpsilon(nfas[i].start);
        }

        return graph;
    }

    parse(regex, acceptState, cs) {
        acceptState = (acceptState === undefined) ? 0 : acceptState;
        cs = (cs === undefined) ? true : cs;

        // reset current index into regex string
        this.source = regex;
        this.sourceLength = this.source.length;
        this.accept = acceptState;
        this.caseSensitive = cs;
        this.index = -1;
        this.stack = [];

        // prime the lexer
        this.advance();

        // parse the regex
        if (this.parseExpression() == false) {
            throw Error("Parse Error: index " + index + " of " + regex);
        }

        return (this.stack.length > 0) ? this.stack[0] : null;
    }

	advance() {
		if (this.index < this.sourceLength) {
            // advance at least one character
            this.index++;

            // now skip whitespace
            while (this.index < this.sourceLength && this.source.charAt(this.index).match(/^\s/)) {
                this.index++;
            }
        }
	}

	eof() {
		return this.index >= this.sourceLength;
	}

	isFirstInAndExpression() {
		var result = true;

        if (this.eof() === false) {
            switch (this.source[this.index]) {
                case '\0':
                case '|':
                case ')':
                case '*':
                case '+':
                case '?':
                case '^':
                case '$':
                    result = false;
                    break;
            }
        }
        else {
            result = false;
        }

        return result;
	}

	parseExpression() {
		var success = true;

        if (this.source.charAt(this.index) == "^") {
            // advance over '^'
            this.advance();

            // TODO: tag start-anchor
        }

        while (success && this.eof() === false) {
            success = this.parseOrExpression();

            if (this.index == this.sourceLength - 1 && this.source.charAt(this.index) == "$") {
                // advance over '$'
                this.advance();

                // TODO: tag end-anchor
            }
        }

        return success;
	}

	parseOrExpression() {
		var success = true;

        if (this.parseAndExpression()) {
            while (this.source.charAt(this.index) == "|") {
                // advance over '|'
                this.advance();

                if (this.parseAndExpression()) {
                    var rhs = this.stack.pop();
                    var lhs = this.stack[this.stack.length - 1];

                    lhs.orMachines(rhs);
                } else {
                    success = false;
                    break;
                }
            }
        }
        else {
            success = false;
        }

        return success;
	}

	parseAndExpression() {
		var success = true;

        if (this.isFirstInAndExpression()) {
            // get lhs
            this.parseFactor();

            // get remaining rhs's
            while (this.isFirstInAndExpression()) {
                if (this.parseFactor()) {
                    var rhs = this.stack.pop();
                    var lhs = this.stack[this.stack.length - 1];

                    lhs.andMachines(rhs);
                } else {
                    success = false;
                    break;
                }
            }
        }
        else {
            success = false;
        }

        return success;
	}

	parseFactor() {
		var success = true;

        if (this.parseTerm()) {
            var node = this.stack[this.stack.length - 1];

            switch (this.source[this.index]) {
                case '*':
                    // advance over '*'
                    this.advance();
                    node.kleeneClosure();
                    break;

                case '+':
                    // advance over '+'
                    this.advance();
                    node.positiveClosure();
                    break;

                case '?':
                    // advance over '?'
                    this.advance();
                    node.option();
                    break;

                default:
                    break;
            }
        }
        else {
            success = false;
        }

        return success;
	}

	parseTerm() {
		var success = true;

        if (this.source[this.index] == '(') {
            success = this.parseSubExpression();
        }
        else {
            var node = new NFAGraph(this.accept);
            var cc;

            switch (this.source[this.index]) {
                case '.':
                    // advance over '.'
                    this.advance();
                    cc = new CharacterClassInput();
                    cc.addInputs("\r", "\n");
                    cc.complement = true;
                    node.add(cc);
                    break;

                case '\\':
                    node.add(this.parseEscapedTerm());
                    break;

                case '[':
                    node.add(this.parseCharacterClass());
                    break;

                default:
                    cc = new CharacterClassInput();
                    cc.addInput(this.source[this.index]);
                    node.add(cc);

                    // advance over character
                    this.advance();
            }

            if (success) {
                this.stack.push(node);
            }
        }

        return success;
	}

	parseCharacterClass() {
		// advance over '['
        this.advance();

        var cci = new CharacterClassInput();
        var last = '\0';

        if (this.source[this.index] == '^') {
            // advance over '^'
            this.advance();

            // find complement of character class
            cci.complement = true;
        }

        if (this.source[this.index] == '-') {
            // advance over '-'
            this.advance();

            cci.addInput('-');
        }

        while (eof() === false && this.source[this.index] != ']') {
            switch (this.source[this.index]) {
                case '-':
                    // advance over '-'
                    this.advance();

                    if (last != '\0') {
                        cci.addInputRange(last, this.source[this.index]);

                        // advance over character
                        this.advance();

                        last = '\0';
                    }
                    else {
                        // error
                        break;
                    }
                    break;

                case '\\':
                    var input = this.parseEscapedTerm();

                    cci.addInputs(input.getCharacters());
                    break;

                default:
                    last = this.source[this.index];
                    cci.addInput(last);

                    // advance over character
                    this.advance();
            }
        }

        if (this.source[this.index] == ']') {
            // advance over ']'
            this.advance();
        }
        else {
            //success = false;
        }

        return cci;
	}

	parseEscapedTerm() {
		var result = null;

        // advance over '\\'
        // NOTE: we can't use advance here since it will skip the next
        // character if it is whitespace
        this.index++;

        switch (this.source[this.index]) {
            case 'd':
                result = new CharacterClassInput();
                result.addInputRange("0", "9");
                result.toString = function() {
                    return "\\d";
                }
                break;

            case 'D':
                result = new CharacterClassInput();
                result.complement = true;
                result.addInputRange("0", "9");
                result.toString = function() {
                    return "\\D";
                }
                break;

            case 'f':
                result = new CharacterClassInput();
                result.addInput("\f");
                break;

            case 'n':
                result = new CharacterClassInput();
                result.addInput("\n");
                break;

            case 'r':
                result = new CharacterClassInput();
                result.addInput("\r");
                break;

            case 's':
                result = new CharacterClassInput();
                result.addInput(' ', '\f', '\t', '\r', '\n', '\u000B');
                result.toString() = function() {
                    return "\\s";
                }
                break;

            case 'S':
                result = new CharacterClassInput();
                result.complement = true;
                result.addInput(' ', '\f', '\t', '\r', '\n', '\u000B');
                result.toString() = function() {
                    return "\\S";
                }
                break;

            case 't':
                result = new CharacterClassInput();
                result.addInput("\t");
                break;

            case 'v':
                result = new CharacterClassInput();
                result.addInput("\u000B");
                break;

            case 'w':
                result = new CharacterClassInput();
                result.addInputRange("a", "z");
                result.addInputRange("A", "Z");
                result.addInputRange("0", "9");
                result.addInput("_");
                result.toString = function() {
                    return "\\w";
                }
                break;

            case 'W':
                result = new CharacterClassInput();
                result.setComplement(true);
                result.addInputRange("a", "z");
                result.addInputRange("A", "Z");
                result.addInputRange("0", "9");
                result.addInput("_");
                result.toString = function() {
                    return "\\W";
                }
                break;

            case 'x':
                var hi = 0;
                var lo = 0;

                this.index++;

                if (this.source[this.index].match(/[0-9a-f]/i)) {
                    throw Error("hex escape sequences not implemented");
                }
                break;

            default:
                result = new CharacterClassInput();
                result.addInput(this.source[this.index]);
                break;
        }

        // advance over term
        this.advance();

        return result;
	}

	parseSubExpression() {
		var success = true;

        // advance over '('
        this.advance();

        if (this.parseOrExpression()) {
            if (this.source[this.index] == ')') {
                // advance over ')'
                this.advance();
            }
            else {
                success = false;
            }
        }
        else {
            success = false;
        }

        return success;
	}
}

module.exports = Regex;
