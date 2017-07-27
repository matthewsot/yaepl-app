function _hangman() {
    var container = document.getElementById("proj");
    container.innerHTML = "";

    var ul = document.createElement("ul");
    ul.id = "hangman-letters";
    container.appendChild(ul);
    
    window.preRun = function () {
        ul.innerHTML = "";
    };

    window.sandbox["addBlank"] = function () {
        var li = document.createElement("li");
        li.innerHTML = " ";
        ul.appendChild(li);
    };

    window.sandbox["fillBlank"] = function (index, letter) {
        ul.children[index].textContent = letter;
    };
}
_hangman();
