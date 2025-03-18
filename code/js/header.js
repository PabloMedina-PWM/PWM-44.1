function toggleMenu() {
    let menu = document.getElementById('menu');
    document.querySelectorAll(".headerLink").forEach(e => {
        e.classList.toggle("visible");
    });
    menu.classList.toggle('show');
}