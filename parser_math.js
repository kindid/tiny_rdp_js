////////////////////////////////////////////////////////////////////////////////
// (C) kuiash.com ltd 2017+ code@kuiash.com ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let Parser = require('./parser.js').Parser

function name_char(parser) {
    return(parser.is('a', 'z') || parser.is('_'))
}

function digit_char(parser) {
    return(parser.is('0', '9'))
}

function first_number_char(parser) {
    return(parser.is('0', '9') || parser.is('-') || parser.is('+'))
}

function name(parser) {
    if (name_char(parser)) {
        while (name_char(parser)) ;
        return true;
    }
}

function number(parser) {
    if (first_number_char(parser)) {
        while (digit_char(parser)) ;
        return true;
    }
}

function mul_op(parser) { return(parser.is('*')) }
function div_op(parser) { return(parser.is('/')) }

// term ::= factor '*' term
// term ::= factor '/' term
// term ::= factor

// automatically calls 'start' - now, when you return you want that
// data back to unwind the stack... there's a total fuck up that needs fixing
function term(parser)
{
    if (parser.is(factor)) {
        if (parser.is(mul_op)) {
            return parser.is(term)
        } else {
            if (parser.is(div_op)) {
                return parser.is(term)
            }
        }
        return true
    }
}

// factor ::= '(' expression ')'
// factor ::= number
// factor ::= name

// pass an array into 'is' to match a whole rule...
// if (parser.is([ '(', expression, ')']))
function factor(parser)
{
    if (parser.is('(')) {
        if (parser.is(expression)) {
            if (parser.is(')')) {
                return true
            }
        }
    } else if (parser.is(number)) {
        return true
    } else if (parser.is(name)) {
        return true
    }
}

// expression ::= term '+' expression
// expression ::= term '-' expression
// expression ::= term

function add_op(parser) { return(parser.is('+')) }
function sub_op(parser) { return(parser.is('-')) }

function expression(parser)
{
    if (parser.is(term)) {
        if (parser.is(add_op)) {
            if (parser.is(expression)) {
                return true
            } else {
                return false
            }
        } else {
            if (parser.is(sub_op)) {
                if (parser.is(expression)) {
                    return true
                } else {
                    return false
                }
            }
        }
        return true
    }
}

let text = process.argv[2]
console.log(text)
// create parser
let P = new Parser(text)
// test it.
let q = P.is(expression)
console.log(q)
for(pb of P.stack) {
    console.log(
        ('            ' + pb.name.name).slice(-12) +
        ('    ' + pb.start).slice(-4) +
        ('    ' + pb.end).slice(-4) +
        '    ' + text.substring(pb.start, pb.end))
}
