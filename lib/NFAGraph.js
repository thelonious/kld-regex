let NFANode = require('./NFANode'),
	Table   = require('kld-text-utils').Table;

class NFAGraph {
	constructor(acceptState) {
		this.start = new NFANode();
		this.end = this.start;
		this.nodes = null;

		this.end.acceptState = (acceptState === undefined) ? -1 : Number(acceptState, 10);
	}

    static join(nfas) {
        var graph = new NGAGraph();
        var result = graph.start;

        for (var i = 0; i < nfas.length; i++) {
            result.addEpsilon(nfas[i].start);
        }

        return graph;
    }

	add(input) {
        // save copy of current end so we can transfer properties later
        var oldEnd = this.end;

        // create a new end node and move over the previous end's accept
        // state
        this.end = new NFANode();
        this.end.acceptState = oldEnd.acceptState;

        // setup transitions
        oldEnd.input = input;
        oldEnd.next = this.end;

        // clear old end's accept state
        oldEnd.acceptState = -1;
    }

    /*
     * andMachines
     */
    andMachines(rhs) {
        // have to copy rhs's start values into end so all things self
        // transition into end will now transition into rhs's start
        this.end.copy(rhs.start);

        // now replace the rhs's start node with the copy we just made.
        // this links the end of lhs to the start of rhs
        rhs.start = this.end;

        // now that the two graphs are linked, point the end of the
        // combined graph to the new end which is the end of the rhs
        this.end = rhs.end;
    }

    /*
     * orMachines
     */
    orMachines(rhs) {
        var front = new NFANode();
        var back = new NFANode();

        // connect the front to the starts of each machine
        front.addEpsilon(this.start);
        front.addEpsilon(rhs.start);

        // transfer accept state to new end node
        back.acceptState = this.end.acceptState;

        // connect ends of each machine to new last state
        this.end.addEpsilon(back);
        rhs.end.addEpsilon(back);

        // clear previous end node accept states
        this.end.acceptState = -1;
        rhs.end.acceptState = -1;

        // update start and end pointers
        this.start = front;
        this.end = back;
    }

    applyClosure(type) {
    	var front = new NFANode();
        var back = new NFANode();

        // point front to current start node
        front.addEpsilon(this.start);

        if (type == "kleene" || type == "option") {
            // add transition to skip entire machine
            front.addEpsilon(back);
        }
        if (type == "kleene" || type == "positive") {
            // add transition from end to start to form a loop
            this.end.addEpsilon(this.start);
        }

        // move accept state to new back node and clear old end's value
        back.acceptState = this.end.acceptState;
        this.end.acceptState = -1;

        // add transition from old end to new end
        this.end.addEpsilon(back);

        // update start and end nodes
        this.start = front;
        this.end = back;
    }

    kleeneClosure() {
        this.applyClosure("kleene");
    }

    positiveClosure() {
        this.applyClosure("positive");
    }

    option() {
        this.applyClosure("option");
    }

    getNodes() {
        if (this.nodes === null) {
        	this.index();
        }

        return this.nodes;
    }

    index() {
        var queue = [this.start];
        var id = 0;

        // initialize node array
        this.nodes = [];

        while (queue.length > 0) {
            var node = queue.shift();

            if (node.id === null) {
                // set node index
                node.id = id++;

                // store reference in node array
                this.nodes[node.id] = node;

                // process next node, if one exists
                if (node.next) {
                    queue.push(node.next);
                }

                // process all epsilon transitions
                for (var i = 0; i < node.epsilon.length; i++) {
                    queue.push(node.epsilon[i]);
                }
            }
        }
    }

    toString() {
        var queue = [this.start];
        var result = [];
        var maxId = -1;
        var table = new Table();

        table.headers = ["Accept", "I/O", "ID", "CSet", "epsilon", "Next"];

        while (queue.length > 0) {
            var node = queue.shift();
            var row = [];

            if (node.id > maxId) {
                maxId = node.id;
            }
            else {
                continue;
            }

            // emit accept state
            row.push((node.acceptState != -1) ? node.acceptState : "")

            // emit entry/exit into/out-of graph
            if (node === this.start && (node === this.end || node.acceptState != -1)) {
                row.push("<->");
            }
            else if (node === this.start) {
                row.push(" ->");
            }
            else if (node === this.end || node.acceptState != -1) {
                row.push("<- ");
            }
            else {
                row.push("");
            }

            // emit node id
            row.push(node.id);

            // emit node character set
            row.push((node.input) ? "(" + node.input.toString() + ")" : "");

            // emit epsilons
            if (node.epsilon.length > 0) {
            	var buffer = []

                for (var i = 0; i < node.epsilon.length; i++) {
                    var epsilon = node.epsilon[i];

                    buffer.push(epsilon.id);

                    if (epsilon.id > node.id) {
                    	queue.push(epsilon);
                    }
                }

                row.push("[" + buffer.join(",") + "]");
            }
            else {
            	row.push("");
            }

            // emit next node
            if (node.next) {
                row.push(node.next.id);

                if (node.next.id > node.id) {
                	queue.push(node.next);
                }
            }

            table.addRow(row);
        }

        return table.toString();
    }
}

module.exports = NFAGraph;
