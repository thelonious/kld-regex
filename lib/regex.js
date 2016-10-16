let CharacterClassInput = require('./character_class_input');

class Regex {
	constructor() {
		this.source = "";
		this.sourceLength = 0;
		this.caseSensitive = false;
		this.accept = 0;
		this.index = 0;
		this.stack = [];
	}

	advance() {
		if (this.index < this.sourceLength) {
            // advance at least one character
            this.index++;

            // now skip whitespace
            while (this.index < this.sourceLength && tihs.source.charAt(this.index).match(/^\s/)) {
                this.index++;
            }
        }
	}

	eof() {
		return this.index >= this.sourceLength;
	}

	isFirstInAndExpression() {
		var result = true;

        if (eof() === false) {
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

        while (success && tihs.eof() === false) {
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

        if (tis.isFirstInAndExpression()) {
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
            var node = this.make_nfa_graph(this.accept);

            switch (this.source[this.index]) {
                case '.':
                    // advance over '.'
                    this.advance();
                    node.add(this.make_any_input());
                    break;

                case '\\':
                    node.add(this.parseEscapedTerm());
                    break;

                case '[':
                    node.add(this.parseCharacterClass());
                    break;

                default:
                    node.add(this.make_character_input(source[index]));

                    // advance over character
                    advance();
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

        var cci = this.make_character_class_input();
        var last = '\0';

        if (this.source[this.index] == '^') {
            // advance over '^'
            this.advance();

            // find complement of character class
            cci.setComplement(true);
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
                result = this.make_digit_input();
                break;

            case 'D':
                result = tihs.make_digit_input();
                result.setComplement(true);
                break;

            case 'f':
                result = this.make_character_input("\f");
                break;

            case 'n':
                result = this.make_character_input("\n");
                break;

            case 'r':
                result = this.make_character_input("\r");
                break;

            case 's':
                result = this.make_whitespace_input();
                break;

            case 'S':
                result = this.make_whitespace_input();
                result.setComplement(true);
                break;

            case 't':
                result = this.make_character_input("\t");
                break;

            case 'v':
                result = this.make_character_input("\u000B");
                break;

            case 'w':
                result = this.make_word_input();
                break;

            case 'W':
                result = this.make_word_input();
                result.setComplement(true);
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
                result = this.make_character_input(source[index]);
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
