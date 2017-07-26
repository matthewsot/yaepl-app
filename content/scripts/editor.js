window.lang = window.location.hash.split('#')[1];

var langDict = { "yaepl": "YAEPL", "javascript": "Javascript" };
document.getElementById("lang").textContent = langDict[window.lang];

var editorArea = document.getElementById("editor");
var editor = CodeMirror.fromTextArea(editorArea, {
    lineNumbers: true,
    autofocus: true,
    mode: window.lang,
});

/*editor.setValue(localStorage.getItem("cached-program") || "");
editor.on("change", function () {
    localStorage.setItem("cached-program", editor.getValue());
});*/

document.getElementById("terminal").innerHTML = "";
var term = new Terminal();
document.getElementById("terminal").appendChild(term.html);

function runYAEPL() {
    term.clear();

    var lines = editor.getValue().split('\n');
    
    var yaepl = new Yaepl({
        outHandle: function (str) { window.term.print(str); },
        promptHandle: function (str, callback) {
            window.term.input(str, function (ret) {
                callback(ret);
            });
        }
    });

    var l = 0;
    var maxL = lines.length;
    function interpretLine(l) {
        yaepl.interpretLine(lines[l], function () {
            l++;
            if (l < maxL) {
                interpretLine(l);
            }
        });
    }
    interpretLine(0);
};
function runJS() {
    term.clear();

    var lines = editor.getValue().split('\n');
    
    var yaepl = new Yaepl({
        outHandle: function (str) { window.term.print(str); },
        promptHandle: function (str, callback) {
            window.term.input(str, function (ret) {
                callback(ret);
            });
        }
    });

    var l = 0;
    var maxL = lines.length;
    function interpretLine(l) {
        yaepl.interpretLine(lines[l], function () {
            l++;
            if (l < maxL) {
                interpretLine(l);
            }
        });
    }
    interpretLine(0);
};
function run() {
    switch (window.lang) {
        case "yaepl":
            runYAEPL();
            break;
        case "javascript":
            runJS();
            break;
    }
}

document.getElementById("run").onclick = run;
editor.setOption("extraKeys", {
    "Ctrl-Space": function (cm) {
        run();
    },
    "Ctrl-S": function (cm) {
        window.save();
    }
});
