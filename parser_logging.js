////////////////////////////////////////////////////////////////////////////////
// (C) kuiash.com ltd 2017+ code@kuiash.com ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function Parser(input) {
    this.input = input
    this.index = 0
    this.stack = []
}

module.exports.Parser = Parser;

// how does one patch up the object tree??
// as each completes

// there's an unwinding problem that is kinda easily fixed - build an array
// pass it down,

function log(depth, verb, test, index) {
    console.log(
        ('   ' + depth).slice(-3) + ' : ' +
        Array(depth * 2).join(' ') + // depth + ' ' +
        ('     ' + verb).slice(-5) +
        (' ' + test + '                   ').slice(0,16) +
        ('     ' + index).slice(-5))
}

function cize(c) {
    if (c === '\s') return '\\t';
    if (c === '\t') return '\\t';
    if (c === '\n') return '\\n';
    if (c === '\r') return '\\r';
    return c + ' ';
}

Parser.prototype.is = function(t, t1) {
    if (t instanceof Function) {
        // surely I should be pushing index somewhere
        log(this.stack.length, 'is', t.name, this.index);
        let depth = this.stack.length;
        this.stack.push({ name:t, start:this.index, end:-1 })
        if (t(this) !== true) {
            // todo - you need to unroll - quite a bit
            // i pass in an 'idx' that has to come back out again - consider
            log(this.stack.length, 'fail', t.name, this.index);
            // rewind a LOT more than this... drop everything to 'depth'
            this.index = this.stack[depth].start;
            this.stack = this.stack.slice(0, depth);
            return false
        } else {
            log(this.stack.length, 'pass', t.name, this.index);
            this.stack[depth].end = this.index
            return true
        }
    } else {
        log(this.stack.length, 'is', cize(t) + cize(t1 || ' '), this.index);
        if (t.length > 1) {
            if (this.input.substr(this.index, t.length) === t) {
                this.index += t.length;
                return true;
            }
            return false;
        } else {
            let cc = this.input[this.index]
            let q = false
            if (t1 === undefined) q = (cc === t)
            else q = (cc >= t && cc <= t1)
            if (q) this.index++;

            if (q) { log(this.stack.length, 'pass', cize(cc || '?') + ' is ' + cize(t) + cize(t1 || ' '), this.index); }
            else { log(this.stack.length, 'fail', cize(cc || '?') + ' is ' + cize(t) + cize(t1 || ' '), this.index); }

            return q
        }
    }
}
