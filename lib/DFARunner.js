class DFARunner {
	constructor(table) {
		this.table = table;
	}

	next(source, offset, length) {
		var startingOffset   = offset,
            currentState     = 0,
            acceptState      = this.table[currentState][1],
            lastAcceptOffset = (acceptState == -1) ? -2 : offset;

        for (var i = offset; i < length; i++) {
            var nextNode = this.table[currentState],
                transitions = nextNode[0],
                ch = source.charCodeAt(i),
                position = 0,
                ch_index;

            for (var index = 0; index < transitions.length; index++) {
                var value = transitions[index],
                    end;

                if (value < 0) {
                    end = position + (-value);
				}
				else if (value > 255) {
					var count = (value >> 8) & 0xFF;

					end = position + count;
                }
                else {
                    end = position + 1;
                }

                if (position <= ch && ch < end) {
                    ch_index = index;
                    break;
                }
                else {
                    position = end;
                }
            }

            var nextState = transitions[ch_index];

			if (nextState > 255) {
				nextState = nextState & 0xFF;
			}

            if (nextState >= 0) {
                currentState = nextState;

                var candidateState = this.table[currentState][1];

                if (candidateState != -1) {
                    lastAcceptOffset = i;
                    acceptState = candidateState;
                }
            }
            else {
                break;
            }
        }

        return {
            startingOffset: startingOffset,
            endingOffset: lastAcceptOffset + 1,
            acceptState: acceptState
        };
	}
}

module.exports = DFARunner;
