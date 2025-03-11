function loadTemplate(fileName, id, callback) {
    fetch(fileName).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById(id).innerHTML = text;
        if (callback) {
            callback();
        }
    });
}

async function init(route, page) {
    const url = "http://localhost:3000/eventos";
    let json;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener los datos");
        }
        json = await response.json();
    } catch (error) {
        console.error("Hubo un error:", error);
        return;
    }

    loadTemplate('../templates/header.html', 'main_header', () => {
        loadTemplate(route.toString(), 'main_section', () => {
            loadTemplate('../templates/footer.html', 'main_footer', () => {
                changeContent(page, json);
            });
        });
    });
}

