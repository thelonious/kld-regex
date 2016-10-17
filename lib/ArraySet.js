class ArraySet {
	constructor() {
		this.items = [];
	}

	get size() {
		return this.items.length;
	}

	add(item) {
		if (this.has(item) === false) {
			this.items.push(item);
		}
	}

	union(set) {
		set.items.forEach(item => this.add(item), this);
	}

	has(target) {
		return this.items.some(item => item === target);
	}

	equals(otherSet) {
		if (this.size === otherSet.size) {
			return otherSet.items.every(item => this.has(item), this);
		}
		else {
			return false;
		}
	}

	item(index) {
		return (0 <= index && index < this.size) ? this.items[index] : null;
	}

	items() {
		return this.items;
	}
}

module.exports = ArraySet;
