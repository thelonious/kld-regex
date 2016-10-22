class NFANode {
    constructor() {
        this.id = null;
        this.next = null;
        this.input = null;
        this.epsilon = [];
        this.acceptState = -1;
    }

    addEpsilon(node) {
        this.epsilon.push(node);
    }

    copy(node) {
        this.next = node.next;
        this.input = node.input;
        this.epsilon = node.epsilon
        this.acceptState = node.acceptState;
    }

    hasCharacter(ch) {
        return (this.input && this.input.hasCharacter(ch));
    }
}

module.exports = NFANode;
