function toggleMenu() {
    let menu = document.getElementById('menu');
    document.querySelectorAll(".headerLink").forEach(e => {
        e.classList.toggle("visible");
    });
    menu.classList.toggle('show');
}

if (JSON.parse(localStorage.getItem("currentUser"))[0].rol !== "Administrador") {
    document.querySelectorAll(".noadminhide").forEach(e => {
        e.style.display = "none";
    });
}