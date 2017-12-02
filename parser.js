////////////////////////////////////////////////////////////////////////////////
// (C) kuiash.com ltd 2017+ code@kuiash.com ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// it's an object because you want it's state
// however, you can't return anything from a 'new' except the object - however(!)
// the object state is complicated and you want to know it. PLUS a pass/fail
// state... no, you really want the output dude...
function Parser(input) {
    this.input = input
    this.index = 0
    this.stack = []
}

module.exports.Parser = Parser;

Parser.prototype.peek = function() { return(this.input[this.index]) }

// todo; if 't' is a long string then match the whole string
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
        let cc = this.peek()
        let q = false
        if (t1 === undefined) q = (cc === t);
        else q = (cc >= t && cc <= t1)
        if (q) this.index++;
        return q;
    }
}
