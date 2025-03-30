function toggleMenu() {
    let menu = document.getElementById('menu');
    document.querySelectorAll(".headerLink").forEach(e => {
        e.classList.toggle("visible");
    });
    menu.classList.toggle('show');
}

if (Object.values(JSON.parse(localStorage.getItem("currentUser"))).some(e => e.rol !== "Administrador")) {
    document.querySelectorAll(".noadminhide").forEach(e => {
        e.style.display = "none";
    });
}