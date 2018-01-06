////////////////////////////////////////////////////////////////////////////////
// (C) kuiash.com ltd 2017+ code@kuiash.com ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let Parser = require('./parser.js').Parser

function name_first_char(parser) {
    // this is where X13SCI wins... this is simply a test of >='a' &&  <= '_'
    return(parser.is('a', 'z') || parser.is('_'))
}

function name_char(parser) {
    // this is where X13SCI wins... this is simply a test of <= 'z'
    return(parser.is('a', 'z') || parser.is('_') || parser.is('0', '9'))
}

function digit_char(parser) {
    // trivial <= '9'
    return(parser.is('0', '9'))
}

function first_number_char(parser) {
    // slightly nasty. -+ can't appear in names as the first character
    // double test
    return(parser.is('0', '9') || parser.is('-') || parser.is('+'))
}

function name(parser) {
    if (name_first_char(parser)) {
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
// as you go down the function names
// you are creating a tree (on the way up and down c2p p2c)
// however, i'm not yet recording that yet.
//

function comment(parser) {
    if (parser.is(';')) {
        // test for \n - if that is not found (true) then continue
        // test for \r - if that is not found (true) then continue
        // if both tests are true (it is not \n AND not \r) then continue
        // one or other WILL fail because the char can't be \n AND \r

        // so - you try '\n' if it does NOT match then you step forward a character
        //

        // if you DO NOT match \n then give up (or semantics) - step forward
        // if you DO NOT match \r then give up (or semantics) - step forward

        // yeah, \n did NOT match - it returns true, the
        // but that means that the OR is gonna give up on you....
        /// that is, you returned 'true' so that next char will continue
//        while(parser.is_not('\n') || parser.is_not('\r')) ;
        while(parser.is_not('\n\r')) ;
        //while(!(parser.is('\n') || parser.is('\r'))) ;
        return true;
    }
}

// wherever you can have white space you can have a comment!
// it starts with ';' and ends with /n or /r
function ws(parser) {
    while(parser.is(' ') || parser.is('\t') || parser.is('\n') || parser.is('\r'));
    parser.is(comment);
    // if (parser.is(';')) {
    //     // consider this as the inversion of all test - it's a test just like about
    //     // but for all characters that you don't have.
    //
    //
    //     // todo; need 'is_not' functionality - exactly the same but swap the meaning
    //     // pass a second parameter if it's true then the operation is inverted
    //     // this reads like shit - should be parser.is_not
    //
    //     // test for \n - if that is not found (true) then continue
    //     // test for \r - if that is not found (true) then continue
    //     // if both tests are true (it is not \n AND not \r) then continue
    //     // one or other WILL fail because the char can't be \n AND \r
    //     // if they both fail
    //
    //     while(parser.is_not('\n') && parser.is_not('\r')) ;

        // skip more whitespace - should this be invoked recursively?
        while(parser.is(' ') || parser.is('\t') || parser.is('\n') || parser.is('\r'));
    //}
    // i'm skeptikal...
    return true;
}

function code(parser) {
    // bug - what if one of these these fails?
    while(parser.is(line)) ;
    return true;
}

function line(parser) {
    if (parser.is(call)) return true;
    if (parser.is(expression)) return true;
}

function call(parser) {
    if(parser.is(name)) {
        if (parser.is(list)) {
            return true;
        }
    }
}

function expression(parser) {
    ws(parser);
    if (parser.is(struct_def)) {
        return true;
    }
    if(parser.is(assign)) {
        return true;
    }
}

function assign(parser) {
    if(parser.is(name)) {
        if (parser.is(equals)) {
            if (parser.is(value)) {
                return true;
            }
        }
    }
}

function struct_lit(parser) {
    ws(parser);
    // dude... just 'return parser.is('#')'
    if (parser.is('#')) {
        return true;
    }
}

function struct_list(parser) {
    ws(parser);
    if (parser.is(list_start)) {
        while(parser.is(assign)) {
            // replace with if (seperator(parser)) as you don't really care to record this!
            if (parser.is(separator)) {
                // expect another value
            } else {
                break;
            }
        }
        if (parser.is(list_end)) return true;
    }
}

function struct_def(parser) {
    ws(parser);
    if (parser.is(name)) {
        if (parser.is(equals)) {
            // let's say you fail here - NOW - i did once make a VERY minimal parser
            // that did not care - not the point..
            // I now return - the output token stack containes an 'equals' and a 'name'
            // what I need to do here is to rewind all the way back to MY start
            // NOW, other starts have been called - BUT I can keep the rewind heap
            // in the parser itself.. watch this...
            if (parser.is(struct_lit)) {
                // a struct does not have to be a list of assignments. surely,
                // only if you want names...
                if (parser.is(struct_list)) {
                    // actually it's a list of assignments... and they ain't easy
                    return true;
                }
            }
        }
    }
}

function equals(parser) {
    ws(parser);
    if (parser.is('=')) {
        return true;
    }
}

function list(parser) {
    if (parser.is(list_start)) {
    // implies list_end can not be value e.g. no value can start with ] (but it can start with [)
        // list_end
        // value list_end
        // value (separator value)* list_end
        // value
        while(parser.is(value)) {
            // input is immutable - clean up is only local
            if (parser.is(separator)) {
                // expect another value
            } else {
                break;
            }
        }
        if (parser.is(list_end)) return true;
    }
}

function list_start(parser) {
    ws(parser);
    if (parser.is('[')) {
        return true;
    }
}

function list_end(parser) {
    ws(parser);
    if (parser.is(']')) {
        return true;
    }
}

// how does a 'comment' fit here? does it count as a seperator
// remember the language isn't really line based - but the end of a comment is a line break
// it acts like white space
function separator(parser) {
    if(parser.is(' ') || parser.is('\t') || parser.is('\n') || parser.is('\r')) {
        ws(parser);
        return true;
    }
}

function value(parser) {
    ws(parser);

    // ah. this will affect 'top' - this is wrong
    // as we have moved back down the stack so this must be updated
    // it is pure happenchance this did not break anything
    // start needs to return some ID that is passed back in here (or does it?)
    // in this instance it is the last thing on the stack - but it needn't be
    if (parser.is(list)) return true;
    if (parser.is(name)) return true;
    if (parser.is(number)) return true;
}

var fs = require('fs')
let text = fs.readFileSync(process.argv[2], {encoding:'utf8'})

console.log(text)
// create parser
let P = new Parser(text)
// test it.
let q = P.is(expression)
console.log("///////////////////////////////////////////////");
console.log(q)
console.log("///////////////////////////////////////////////");
for(pb of P.stack) {
    console.log(
        ('            ' + pb.name.name).slice(-12) +
        ('    ' + pb.start).slice(-4) +
        ('    ' + pb.end).slice(-4) +
        '    ' + text.substring(pb.start, pb.end))
}
console.log("///////////////////////////////////////////////");
