let esprima = require("esprima");
let escodegen = require("escodegen");
function wrapSingle(el) {
    if (el === undefined) return undefined;

    el.argument = wrapSingle(el.argument);
    el.arguments = wrapList(el.arguments);

    el.left = wrapSingle(el.left);
    el.right = wrapSingle(el.right);

    if (el.type == "CallExpression") {
        el = {
            type: 'AwaitExpression',
            argument: el
        };
    }

    el.expression = wrapSingle(el.expression);
    el.body = wrapList(el.body);
    return el;
}
function wrapList(list) {
    if (list === undefined) return undefined;

    if (list.body !== undefined) {
        list.body = wrapList(list.body);
        return list;
    }

    var newList = []
    for (var i = 0; i < list.length; i++) {
        list[i] = wrapSingle(list[i]);
    }
    return list;
}

function wrapAwait(script) {
    var parsed = esprima.parse(script).body;

    var functions = [];
    var body = [];
    for (var i = 0; i < parsed.length; i++) {
        if (parsed[i].type == "FunctionDeclaration") {
            parsed[i].async = true;
            parsed[i].body = wrapList(parsed[i].body);
            functions.push(parsed[i]);
        } else {
            body.push(parsed[i]);
        }
    }
    body = wrapList(body);

    var pre = escodegen.generate({ type: "Program", body: functions });
    var internal = escodegen.generate({ type: "Program", body: body });

    return pre + "\nasync function __main_script__() {\n" + internal + "\n}\n__main_script__();";
}
