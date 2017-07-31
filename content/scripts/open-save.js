var fs = require('fs');
var remote = require('electron').remote;
var dialog = remote.require('electron').dialog;

window.fileName = null;

var extension = { "javascript": "js", "yaepl": "yaepl" }[window.lang];
var filter = { name: window.lang + " files", extensions: [extension] };

window.open = function () {
    dialog.showOpenDialog({ filters: [ filter] },
        function (fileNames) {
            if (fileNames === undefined) return;
            window.fileName = fileNames[0];
            fs.readFile(window.fileName, 'utf-8', function (err, data) {
                editor.setValue(data);
            });
        });
};

document.getElementById("open").onclick = window.open;

window.newFile = function () {
    editor.setValue("");
    term.clear();
    window.fileName = fileName;
};

window.saveAs = function () {
    dialog.showSaveDialog({ filters: [ filter ] },
        function (fileName) {
            if (fileName === undefined) return;
            window.fileName = fileName;
            window.save();
        });
};

window.save = function () {
    if (window.fileName !== null) {
        fs.writeFile(window.fileName, editor.getValue(), function (err) {});
    } else {
        window.saveAs();
    }
};

document.getElementById("save").onclick = function () {
    dialog.showSaveDialog({ filters: [ filter ] },
        function (fileName) {
            if (fileName === undefined) return;
            window.fileName = fileName;
            window.save();
        });
};
