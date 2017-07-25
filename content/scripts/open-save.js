var fs = require('fs');
var remote = require('electron').remote;
var dialog = remote.require('electron').dialog;

window.fileName = null;

document.getElementById("open").onclick = function () {
    dialog.showOpenDialog({ filters: [
       { name: 'YAEPL Files', extensions: ['yaepl'] }
    ]},
    function (fileNames) {
        if (fileNames === undefined) return;
        window.fileName = fileNames[0];
        fs.readFile(window.fileName, 'utf-8', function (err, data) {
            editor.setValue(data);
        });
    });
};

window.save = function () {
    if (window.fileName !== null) {
        fs.writeFile(window.fileName, editor.getValue(), function (err) {});
    }
};

document.getElementById("save").onclick = function () {
    dialog.showSaveDialog({ filters: [
        { name: 'YAEPL Files', extensions: ['yaepl'] }
    ]},
    function (fileName) {
        if (fileName === undefined) return;
        window.fileName = fileName;
        window.save();
    });
};
