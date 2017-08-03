/*
 * Because our custom prompt uses a callback/promise,
 * we need to modify the code to ensure that it works
 * as the student expects.
 *
 * The wrapAwait function returns a new script that 
 * marks all global functions async, then awaits all
 * function calls.
 *
 * NOTE - this has serious issues for more complex
 * Javascript, so using this for anything beyond
 * introductory code is not supported or tested.
 */

let esprima = require("esprima");
let escodegen = require("escodegen");

function wrapSingle(el) {
    if (el === undefined) return undefined;

    el.argument = wrap(el.argument);
    el.init = wrap(el.init);
    el.consequent = wrap(el.consequent);
    el.arguments = wrap(el.arguments);
    el.declarations = wrap(el.declarations);

    el.left = wrap(el.left);
    el.right = wrap(el.right);

    if (el.type == "CallExpression") {
        el = {
            type: 'AwaitExpression',
            argument: el
        };
    }

    el.expression = wrap(el.expression);
    el.body = wrap(el.body);
    return el;
}
function wrapList(list) {
    if (list === undefined) return undefined;

    if (list.body !== undefined) {
        list.body = wrap(list.body);
        return list;
    }

    var newList = []
    for (var i = 0; i < list.length; i++) {
        list[i] = wrap(list[i]);
    }
    return list;
}
function wrap(el) {
    if (Array.isArray(el)) return wrapList(el);
    return wrapSingle(el);
}

function wrapAwait(script) {
    var parsed = esprima.parse(script).body;

    var functions = [];
    var body = [];
    for (var i = 0; i < parsed.length; i++) {
        if (parsed[i].type == "FunctionDeclaration") {
            parsed[i].async = true;
            parsed[i].body = wrap(parsed[i].body);
            functions.push(parsed[i]);
        } else {
            body.push(parsed[i]);
        }
    }
    body = wrap(body);

    var pre = escodegen.generate({ type: "Program", body: functions });
    var internal = escodegen.generate({ type: "Program", body: body });

    return pre + "\nasync function __main_script__() {\n" + internal + "\n}\n__main_script__();";
}
