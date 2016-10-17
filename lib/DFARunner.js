class DFARunner {
	constructor(table) {
		this.table = table;
	}

    all(source, offset, length) {
        offset = (offset === undefined) ? 0 : Math.max(0, Number(offset));
        length = (length === undefined) ? source.length :  Math.min(length, source.length);

        var matches = [];

        do {
            var result = this.next(source, offset, length);

            if (result !== null) {
                matches.push(result);
                offset = result.endingOffset;
            }
            else {
                offset++;
            }
        } while (offset < source.length);

        return matches;
    }

	next(source, offset, length) {
        offset = (offset === undefined) ? 0 : Math.max(0, Number(offset));
        length = (length === undefined) ? source.length :  Math.min(length, source.length);

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

        if (acceptState !== -1) {
            return {
                startingOffset: startingOffset,
                endingOffset: lastAcceptOffset + 1,
                type: acceptState,
                text: source.substring(startingOffset, lastAcceptOffset + 1)
            };
        }
        else {
            return null;
        }
	}
}

module.exports = DFARunner;
