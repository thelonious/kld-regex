let format = require('kld-text-utils').format;

class CharacterClassInput {
    constructor() {
        this.characters = {};
        this.complement = false;
        this.caseSensitive = true;
        this.alias = null;
    }

    addInput() {
        for (var i = 0; i < arguments.length; i++) {
            var ch = arguments[i];

            if (this.caseSensitive === false) {
                this.characters[ch.toLowerCase()] = true;
                this.characters[ch.toUpperCase()] = true;
            }
            else {
                this.characters[ch] = true;
            }
        }
    }

    addInputRange(c1, c2) {
        function applyRange(self, c1_code, c2_code) {
            for (var c = c1_code; c <= c2_code; c++) {
                self.characters[String.fromCharCode(c)] = true;
            }
        }

        if (this.caseSensitive === false) {
            applyRange(
                this,
                c1.toLowerCase().charCodeAt(0),
                c2.toLowerCase().charCodeAt(0)
            );
            applyRange(
                this,
                c1.toUpperCase().charCodeAt(0),
                c2.toUpperCase().charCodeAt(0)
            );
        } else {
            applyRange(
                this,
                c1.charCodeAt(0),
                c2.charCodeAt(0)
            );
        }
    }

    getCharacters() {
        var chars = [];

        for (var p in this.characters) {
            if (this.characters.hasOwnProperty(p)) {
                chars.push(p);
            }
        }

        return chars.sort();
    }

    hasCharacter(ch) {
        return this.characters.hasOwnProperty(ch) !== this.complement;
    }

    toString() {
        if (this.alias !== null) {
            return this.alias;
        }
        else {
            var chars = this.getCharacters();
            var result = [];

            for (var i = 0; i < chars.length; i++) {
                if (i > 0) {
                    result.push(",");
                }

                var ch = chars[i];
                var ch_code = ch.charCodeAt(0);

                if (this.complement) {
                    result.push("~");
                }

                if (32 < ch_code && ch_code < 127) {
                    result.push(chars[i]);
                }
                else {
                    result.push(format("\\x{0:X2}", ch_code));
                }
            }

            return result.join("");
        }
    }
}

module.exports = CharacterClassInput;
