document.getElementById("menu-toggle").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.right === "100%") {
        sidebar.style.right = "-20";
        sidebar.style.display = "block";
        document.getElementById("menu-toggle").style.display = "none";
        document.getElementById("menu-toggle2").style.display = "block";
        document.getElementById("titulo").style.color = ""

    } else {
        sidebar.style.right = "100%";
        sidebar.style.display = "none";
        document.getElementById("menu-toggle").style.display = "block";
        document.getElementById("menu-toggle2").style.display = "none";
        document.getElementById("titulo").innerHTML = "MEMORYS";
    }
});
document.getElementById("menu-toggle2").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.right === "100%") {
        sidebar.style.right = "-20";
        sidebar.style.display = "block";
        document.getElementById("menu-toggle").style.display = "none";
        document.getElementById("menu-toggle2").style.display = "block";
        document.getElementById("titulo").innerHTML = "  ";

    } else {
        sidebar.style.right = "100%";
        sidebar.style.display = "none";
        document.getElementById("menu-toggle").style.display = "block";
        document.getElementById("menu-toggle2").style.display = "none";
        document.getElementById("titulo").innerHTML = "MEMORYS";
    }
});