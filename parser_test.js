////////////////////////////////////////////////////////////////////////////////
// (C) kuiash.com ltd 2017+ code@kuiash.com ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let Parser = require('./parser.js').Parser
////////////////////////////////////////////////////////////////////////////////

// doesn't pass/fail (can kinda do it itself).... wtf?
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

////////////////////////////////////////////////////////////////////////////////

function try_this(text, fn, expect)
{
    console.log("//////////////////////////////////////////////////////////////////////////////////////////")
    console.log("attempting \"" + text + "\"");
    // create
    let P = new Parser(text);
    // invoke
    let q = P.is(fn)
    console.log("==========================================================================================")
    for(pb of P.stack) {
        console.log(pb.name.name, pb.start, pb.end, text.substring(pb.start, pb.end))
    }
    console.log("==========================================================================================")
    if (q !== expect) {
        console.log("TEST FAILED")
    } else {
        console.log("TEST PASSED")
    }
}

//try_this("abcd", number, false)
//try_this("abcd", name, true)
//try_this("0128", number, true)
//try_this("0128", name, false)
//try_this("[]", list, true)
try_this("[bob 123 [efg xyzw -666] []]", list, true)
