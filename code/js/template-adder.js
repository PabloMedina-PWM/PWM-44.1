function loadTemplate(fileName, id, callback) {
    fetch(fileName).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById(id).innerHTML = text;
        if (callback) {
            callback();
        }
        let headerScript = document.createElement("script");
        headerScript.src = "../js/header.js";
        document.head.append(headerScript);
    });
}

/*async function init(route, page) {
    if (page !== "index" && sessionStorage.getItem("currentUser") === null) {
        window.location.href = "../html/index.html";
    }
    const url = "http://localhost:3000/" + page;
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
*/

async function init(route, page) {
    if (page !== "index" && sessionStorage.getItem("currentUser") === null) {
        window.location.href = "../html/index.html";
    }
    const url = "http://localhost:3000/" + page;
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

    try {
        await loadTemplateAsync('../templates/header.html', 'main_header');
        await loadTemplateAsync(route.toString(), 'main_section');
        await loadTemplateAsync('../templates/footer.html', 'main_footer');
        changeContent(page, json);
    } catch (error) {
        console.error("Hubo un error al cargar las plantillas:", error);
    }
}

function loadTemplateAsync(url, elementId) {
    return new Promise((resolve, reject) => {
        loadTemplate(url, elementId, () => {
            resolve();
        }, (error) => {
            reject(error);
        });
    });
}

