async function changeContent(page, json) {
    document.getElementById("titulo1").innerText = json.titulo;
    await createFilters(json);
    await createTable(json);
    await addButton(json);
    const urlParams = new URLSearchParams(window.location.search);
    for (const [param, value] of urlParams.entries()) {
        if (param !== "_ijt" && param !== "_ij_reload" ) {
            await filter(json, param, value);
        }
    }
    document.getElementById("search").addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            await search(json, event.target.value);
        }
    });
    let fecha = document.getElementById("fecha");
    if (fecha) {
        fecha.addEventListener("change", async (event) => {
            await filter(json, "fecha", event.target.value);
        });
    }
}

async function createFilters(json) {
    let filtros = json.nombreFiltros;
    filtros.forEach(filtro => {
        if (filtro === "Fecha") {
            let input = document.createElement("input");
            input.type = "date";
            input.classList.add("search-filter");
            input.id = "fecha";
            document.getElementById("filters").appendChild(input);
            document.getElementById("filters").appendChild(input);
        } else {
            let sel = document.createElement("select");
            sel.innerHTML = "<option value=\"\" selected>"+ filtro + "</option>";
            sel.classList.add("search-filter");
            sel.classList.add("filtro");
            sel.id = filtro.toLowerCase();
            sel.onchange = async () => await filter(json, filtro.toLowerCase(), sel.value);
            document.getElementById("filters").append(sel);
            let mobileFilter = sel.cloneNode(true);
            mobileFilter.classList.add("mobile-filtro");
            mobileFilter.classList.add("hidden");
            mobileFilter.classList.remove("filtro");
            mobileFilter.id = filtro.toLowerCase()+"-mobile";
            mobileFilter.onchange = async () => await filter(json, filtro.toLowerCase(), mobileFilter.value);
            document.getElementById("mobile-filters").append(mobileFilter);
        }

    });
}

async function createTable(json) {
    await addHeaders(json);
    await addData(json);
}

async function addHeaders(json) {
    let headers = json.nombreColumnas;
    let head = document.createElement("thead");
    headers.forEach(header => {
        let th = document.createElement("th");
        th.innerText = header;
        head.appendChild(th);
    });
    document.getElementById("table-viewer").appendChild(head);
}

async function addData(json) {
    let datos = await getData(json.titulo.toLowerCase());
    let numColumnas = json.nombreColumnas.length;
    for (let dato in datos) {
        let padre = datos[dato];
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = dato;
        tr.appendChild(td1);
        tr.id = dato;
        tr.classList.add("fila");
        let index = 0;
        for (let hijo in padre) {
            if (index === numColumnas-2 && json.nombreBotonTabla !== undefined) {
                let td2 = document.createElement("td");
                let button = document.createElement("button");
                button.classList.add("button_colum");
                button.innerText = json.nombreBotonTabla;
                button.onclick = () => {
                    window.location.href = padre[hijo];
                }
                td2.appendChild(button);
                tr.appendChild(td2);
            } else if (index >= numColumnas-1) {
                await addOptionToFilter(hijo, padre[hijo]);
            } else {
                let td2 = document.createElement("td");
                const nombreFiltros = json.nombreFiltros.map(e=>e.toLowerCase());
                if (typeof padre[hijo] === "object") {
                    td2.innerText = padre[hijo].nombre;
                    for (let field in padre[hijo]) {
                        if (nombreFiltros.includes(field.toLowerCase()) && padre[hijo][field] !== "-") {
                            await addOptionToFilter(field, padre[hijo][field]);
                        }
                    }
                } else {
                    td2.innerText = padre[hijo];
                    if (nombreFiltros.includes(hijo.toLowerCase()) && padre[hijo] !== "-") {
                        await addOptionToFilter(hijo, padre[hijo]);
                    }
                }
                tr.appendChild(td2);
            }
            index++;
        }
        document.getElementById("table-viewer").appendChild(tr);
    }
}

async function addOptionToFilter(filterName, optionName) {
    if (filterName === "fecha") return;
    let filter = document.getElementById(filterName);
    if (!filter) {
        filterName = filterName.slice(0,-1);
        filter = document.getElementById(filterName);
    }
    const valores = Array.from(filter.options).map(opcion => opcion.value.toString());
    if (valores.includes(optionName.toString())) {
        return;
    }
    if (Array.isArray(optionName)) {
        for (let option of optionName) {
            if (valores.includes(option)) return;
            let opt = document.createElement("option");
            opt.innerText = option;
            document.getElementById(filterName).appendChild(opt);
            document.getElementById(filterName+"-mobile").appendChild(opt.cloneNode(true));
        }
    } else {
        let option = document.createElement("option");
        option.innerText = optionName;
        document.getElementById(filterName).appendChild(option);
        document.getElementById(filterName+"-mobile").appendChild(option.cloneNode(true));
    }
}

async function addButton(json) {
    document.getElementById("add-button").innerText = json.nombreBoton;
    document.getElementById("add-button").onclick = () => {
        window.location.href = json.enlaceBoton;
    }
}

let filtrosActivos = [];

function updateVisibility(datos) {
    for (let dato in datos) {
        let debeMostrar = true;

        for (let filtro of filtrosActivos) {
            let cumpleFiltro = false;

            for (let campo in datos[dato]) {
                if (campo === filtro.field) {
                    if (filtro.field === "fecha" && !isNaN(Date.parse(datos[dato][campo]))) {
                        cumpleFiltro = new Date(datos[dato][campo]) <= new Date(filtro.equals);
                    } else {
                        cumpleFiltro = datos[dato][campo].toString() === filtro.equals.toString();
                    }
                } else if (typeof datos[dato][campo] === "object") {
                    if (Array.isArray(datos[dato][campo])) {
                        cumpleFiltro = datos[dato][campo].some(valor => valor?.toString() === filtro.equals.toString());
                    } else {
                        cumpleFiltro = datos[dato][campo][filtro.field]?.toString() === filtro.equals.toString();
                    }
                }

                if (cumpleFiltro) break;
            }

            if (!cumpleFiltro) {
                debeMostrar = false;
                break;
            }
        }

        if (debeMostrar) {
            document.getElementById(dato).classList.remove("hidden");
        } else {
            document.getElementById(dato).classList.add("hidden");
        }
    }
}


async function filter(json, field, equals) {
    if (equals === "") {
        filtrosActivos = filtrosActivos.filter(filtro => filtro.field !== field);
    } else {
        filtrosActivos = filtrosActivos.filter(filtro => filtro.field !== field);
        filtrosActivos.push({ field, equals });
    }

    let datos = await getData(json.titulo.toLowerCase());
    updateVisibility(datos);
}


async function getData(page){
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
    return json;
}

function filters() {
    document.querySelectorAll(".mobile-filtro").forEach(e => {
        e.classList.toggle("hidden");
        e.classList.toggle("visible-filter");
    });
}

function checkFilters() {
    if (window.innerWidth > 768) {
        document.querySelectorAll(".mobile-filtro").forEach(e => {e.style.display = "none";});
    } else {
        document.querySelectorAll(".mobile-filtro").forEach(e => {e.style.display = "";});
    }
}

async function search(json, equals) {
    let datos = await getData(json.titulo.toLowerCase());

    for (let dato in datos) {
        let cumpleBusqueda = false;

        // Verificar si la clave coincide con el criterio de búsqueda
        if (dato.toString().toLowerCase().includes(equals.toLowerCase())) {
            cumpleBusqueda = true;
        }

        // Verificar si algún valor dentro de los campos coincide con el criterio de búsqueda
        for (let campo in datos[dato]) {
            let valor = datos[dato][campo];

            if (typeof valor === "object") {
                // Si el valor es un objeto o array, revisamos sus valores internos
                if (Array.isArray(valor)) {
                    cumpleBusqueda = valor.some(item => item?.toString().toLowerCase().includes(equals.toLowerCase()));
                } else {
                    for (let subcampo in valor) {
                        if (valor[subcampo]?.toString().toLowerCase().includes(equals.toLowerCase())) {
                            cumpleBusqueda = true;
                            break;
                        }
                    }
                }
            } else {
                // Si el valor es directo (string, number, etc.), lo comparamos
                if (valor?.toString().toLowerCase().includes(equals.toLowerCase())) {
                    cumpleBusqueda = true;
                }
            }

            if (cumpleBusqueda) break;
        }

        // Mostrar u ocultar la fila según el resultado de la búsqueda
        if (cumpleBusqueda) {
            document.getElementById(dato).classList.remove("hidden");
        } else {
            document.getElementById(dato).classList.add("hidden");
        }
    }
}


window.addEventListener("resize", checkFilters);