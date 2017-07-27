var lis = document.querySelectorAll("nav > ul > li");
for (var l = 0; l < lis.length; l++) {
    lis[l].onclick = function () {
        document.getElementById("view").src = "editor.html#" + this.getAttribute("lang") + "," + this.getAttribute("proj");
    };
}
