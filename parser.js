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

Parser.prototype.is = function(t, t1) {
    if (t instanceof Function) {
        let depth = this.stack.length
        this.stack.push({ name:t, start:this.index, end:-1 })
        if (t(this) !== true) {
            this.stack.pop()
            return false
        } else {
            this.stack[depth].end = this.index
            return true
        }
    } else {
        let cc = this.input[this.index]
        let q = false
        if (t1 === undefined) q = (cc === t)
        else q = (cc >= t && cc <= t1)
        if (q) this.index++;
        return q
    }
}
