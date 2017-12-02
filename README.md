# tiny_rdp_js

## A Tiny Recursive Descent Parser in Javascript

More to come, I've just added this out of interest more than anything.

TODO

1. Allow an array to be passed into `parser.is()` as this will make writing rules far more compact
2. Allow matching of whole strings not just characters
3. Build an actual tree instead of just spans of characters
4. Allow a rule recording to be turned on/off as sometimes you don't care about intermediate nodes in the tree (e.g. `value`, you only care about `number` or `name`)

```javascript

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
```

Above is the guts of the whole thing.

### Example

This parser shows a simple list with integers and names where a list can contain lists of lists and so on.

```javascript
function name_char(parser) {
    return(parser.is('a', 'z') || parser.is('_'))
}

function digit_char(parser) {
    return(parser.is('0', '9'))
}

function first_number_char(parser) {
    return(parser.is('0', '9') || parser.is('-') || parser.is('+'))
}

function separator(parser) {
    return parser.is(' ');
}

function name(parser) {
    if (name_char(parser)) {
        while (name_char(parser)) ;
        return true;
    }
}

function value(parser) {
    if (parser.is(name)) return true
    else if (parser.is(number)) return true
    else if (parser.is(list)) return true
}

function list(parser) {
    if (parser.is('[')) {
        while(parser.is(value)) {
            if(!parser.is(separator)) break;
        }
        if (parser.is(']')) {
            return true;
        }
    }
}

function number(parser) {
    if (first_number_char(parser)) {
        while (digit_char(parser)) ;
        return true;
    }
}
```

### Invokation

Firstly require the parser then create a parser object then try and parse using the ```is``` function.

It will return true or false.

```javascript
let P = new Parser(text);
let q = P.parse(my_parsing_function)
```

(C) kuiash.com 2017
