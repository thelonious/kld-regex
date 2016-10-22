let Regex             = require('./Regex'),
    NFAGraph          = require('./NFAGraph');
    NFAGraphConverter = require('./NFAGraphConverter');

class Lexer {
    constructor() {
        this.nfa = null;
        this.dfa = null;
    }

    compile(tokens) {
        var parser = new Regex();

        // build NFAs for each token
        var nfas = tokens.map((token, index) => {
            return parser.parse(token.pattern, index, token.caseSensitive);
        });

        this.nfa = NFAGraph.join(nfas);

        // build DFA and runner
        var compiler = new NFAGraphConverter();
        var runner = compiler.convert(this.nfa);

        this.dfa = compiler.dfa_nodes;

        return runner;
    }
}

module.exports = Lexer;
