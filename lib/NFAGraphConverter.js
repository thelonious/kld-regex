let ArraySet = require('./ArraySet');

class DFANode {
	constructor(nfa_node_set, id) {
		this.nfa_node_set = nfa_node_set;
		this.id = id;
		this.transitions = {};
		this.acceptState = -1;
	}

	getTransition(ch) {
		return (this.transitions.hasOwnProperty(ch)) ? this.transitions[ch] : null;
	}

	setTransition(ch, dfa_node) {
		this.transitions[ch] = dfa_node;
	}

	toString() {
		var items = this.nfa_node_set.entries();
        
        return items
	        .sort((a, b) => a.index - b.index)
	        .map(item => String(item.id))
	        .join(",");
	}
}

class NFAGraphConverter {
	constructor() {
		this.nfa_nodes = null;
		this.dfa_nodes = null;
	}

	createDFANode(nfa_node_set) {
		let id = this.dfa_nodes.length;
		let node = new DFANode(nfa_node_set, id);

		node.iod
		this.dfa_nodes.push(node);

		return node;
	}

	convert(nfa) {
		this.nfa_nodes = nfa.getNodes();
		this.dfa_nodes = [];

		this.createDFANode(
			this.getEpsilonReachable(
				nfa.start
			)
		);

		this.dfa_nodes.forEach(node => this.processTransitions(node), this);

		return this.dfa_nodes;
	}

	getEpsilonReachable(nfa_node) {
        var result = new ArraySet();

        result.add(nfa_node)

        for (var i = 0; i < result.size; i++) {
            var current_node = result.item(i);

            current_node.epsilon.forEach(item => result.add(item));
        }

        return result;
    }

    getTransitionReachable(nfa_node, ch) {
    	var result;

        if (nfa_node.hasCharacter(ch)) {
            result = this.getEpsilonReachable(nfa_node.next);
        }
        else {
            result = new ArraySet();
        }

        return result;
    }

    getDfaNodeByReachableStates(reachable) {
        var result = null;

        for (var i = 0; i < this.dfa_nodes.length; i++) {
            var dfa_node = this.dfa_nodes[i];

            if (dfa_node.nfa_node_set.equals(reachable)) {
                result = dfa_node;
                break;
            }
        }

        return result;
    }

    processTransitions(dfa_node) {
    	var nfa_nodes = dfa_node.nfa_node_set;

        for (var i = 0; i < 256; i++) {
            var reachable = new ArraySet();
            var ch = String.fromCharCode(i);

            this.nfa_nodes.forEach(nfa_node => {
                reachable.union(this.getTransitionReachable(nfa_node, ch));

                if (nfa_node.acceptState != -1 && dfa_node.acceptState != nfa_node.acceptState) {
                    var current = dfa_node.acceptState;
                    var candidate = nfa_node.acceptState;
                    var newValue = (current != -1) ? Math.min(current, candidate) : candidate;

                    if (current != newValue) {
                        dfa_node.acceptState = newValue;
                        //print("(" + current + "," + candidate + ") => " + newValue);
                    }
                }
            }, this);

            if (reachable.size > 0) {
                var target_dfa_node = this.getDfaNodeByReachableStates(reachable);

                if (target_dfa_node === null) {
                    target_dfa_node = this.createDFANode(reachable);
                }

                dfa_node.setTransition(ch, target_dfa_node);
            }
            else {
                dfa_node.setTransition(ch, null);
            }
        }
    }
}

module.exports = NFAGraphConverter;
