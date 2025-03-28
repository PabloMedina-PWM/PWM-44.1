async function changeContent(page, json) {
    document.getElementById("titulo1").innerText = json.titulo;
    await createFilters(json);
    await createTable(json);
    await addButton(json);
    const urlParams = new URLSearchParams(window.location.search);
    for (const [param, value] of urlParams.entries()) {
        if (param !== "_ijt" && param !== "_ij_reload" ) {
            await filter(json, param, value);
            document.getElementById(param).value = value;
        }
    }
    document.getElementById("search").addEventListener("input", async (event) => {
        await search(json, document.getElementById("search").value);
    });
    let fecha = document.getElementById("fecha");
    if (fecha) {
        fecha.addEventListener("change", async (event) => {
            await filter(json, "fecha", event.target.value);
        });
    }
    let capacidad = document.getElementById("capacidad");
    if (capacidad) {
        capacidad.addEventListener("keyup", async (event) => {
            if (event.key === "Enter") {
                await filter(json, "capacidad", event.target.value);
            } else if (event.key === "Backspace") {
                if (event.target.value === "") {
                    await filter(json, "capacidad", event.target.value);
                }
            }
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
        } else if (filtro === "Capacidad") {
            let capacidad = document.createElement("input");
            capacidad.type = "number";
            capacidad.id = "capacidad";
            capacidad.classList.add("search-filter");
            capacidad.placeholder = "Capacidad máx.";
            capacidad.style.width = "14.5rem";
            document.getElementById("filters").appendChild(capacidad);
        } else {
            let sel = document.createElement("select");
            sel.innerHTML = "<option value=\"\" hidden selected>"+ filtro + "</option>";
            sel.classList.add("search-filter");
            sel.classList.add("filtro");
            sel.id = filtro.toLowerCase();
            sel.onchange = async () => await filter(json, filtro.toLowerCase(), sel.value);
            let op = document.createElement("option");
            op.text = "Eliminar filtro";
            sel.appendChild(op);
            sel.addEventListener("change", () => {
                if (sel.value === "Eliminar filtro") {
                    sel.selectedIndex = 1;
                }
            });
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
    const jsonOrdenado = await ordenarJson(datos, json.ordenarPor);
    for (let dato in jsonOrdenado) {
        let padre = datos[dato];
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        tr.id = dato;
        tr.classList.add("fila");
        let index = -1;
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
                        } else if (field === "nombre") {
                            await addOptionToFilter(hijo, padre[hijo][field]);
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
        tr.addEventListener("click", async () => {
            let url = "../html/crud_";
            url += json.titulo.slice(0,-1).toLowerCase() + ".html";
            url += "?" + "id=";
            url += padre.id;
            window.open(url, '_blank');
        });
        tr.addEventListener('mouseover', () => {
            tr.style.backgroundColor = 'lightgray';
            tr.title = "Abrir en nueva pestaña";
        });

        tr.addEventListener('mouseout', () => {
            tr.style.backgroundColor = '';
        });
        tr.style.cursor = "pointer";
        document.getElementById("table-viewer").appendChild(tr);
    }
}

async function addOptionToFilter(filterName, optionName) {
    if (filterName === "fecha" || filterName === "capacidad" || filterName === "emailEmpleado" || filterName === "id") return;
    if (filterName === "direccion" || filterName === "idTarea" || filterName === "nombre" || filterName === "artistas") return;
    let filter = document.getElementById(filterName);
    if (!filter) {
        console.log(filterName);
        filterName = filterName.slice(0, -1);
        filter = document.getElementById(filterName);
    }

    // Encuentra la opción "Eliminar filtro" si existe
    const eliminarFiltrosOption = Array.from(filter.options).find(option => option.value === "Eliminar filtro");

    const opcionPorDefecto = Array.from(filter.options).find(option => option.defaultSelected);

    const valores = Array.from(filter.options)
        .filter(opcion => !opcion.defaultSelected && opcion.value !== "Eliminar filtro")
        .map(opcion => opcion.value.toString());

    if (Array.isArray(optionName)) {
        for (let option of optionName) {
            if (!valores.includes(option.toString())) {
                valores.push(option.toString());
            }
        }
    } else if (typeof optionName === "object") {

    }
    else {
        if (!valores.includes(optionName.toString())) {
            valores.push(optionName.toString());
        }
    }

    // Ordena las opciones desde la segunda en adelante
    valores.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

    filter.innerHTML = "";
    document.getElementById(filterName + "-mobile").innerHTML = "";

    // Agrega primero la opción "Eliminar filtro" si existe
    if (eliminarFiltrosOption) {
        filter.appendChild(eliminarFiltrosOption.cloneNode(true));
        document.getElementById(filterName + "-mobile").appendChild(eliminarFiltrosOption.cloneNode(true));
    }

    // Agrega la opción por defecto, si existe
    if (opcionPorDefecto) {
        filter.appendChild(opcionPorDefecto.cloneNode(true));
        document.getElementById(filterName + "-mobile").appendChild(opcionPorDefecto.cloneNode(true));
    }

    // Agrega las opciones restantes (ordenadas)
    for (let valor of valores) {
        let opt = document.createElement("option");
        opt.innerText = valor;
        opt.value = valor;
        filter.appendChild(opt);

        let optMobile = opt.cloneNode(true);
        document.getElementById(filterName + "-mobile").appendChild(optMobile);
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
                    } else if (filtro.field === "capacidad") {
                        cumpleFiltro = datos[dato][campo] <= filtro.equals;
                    } else if (typeof datos[dato][campo] === "object") {
                        cumpleFiltro = datos[dato][campo].nombre === filtro.equals.toString();
                    }
                    else {
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
    if (equals === "" || equals === "Eliminar filtro") {
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

async function ordenarJson(json, criterio) {
    if (criterio === "campo") {
        // Ordenar por las claves del objeto alfabéticamente
        return Object.keys(json)
            .sort() // Ordenar las claves
            .reduce((obj, clave) => {
                obj[clave] = json[clave];
                return obj;
            }, {});
    } else {
        // Ordenar por un campo específico dentro de los valores si son objetos
        const jsonComoArray = Object.entries(json);
        const jsonOrdenado = jsonComoArray.sort(([keyA, valueA], [keyB, valueB]) => {
            // Verifica que los valores sean objetos y tengan el campo especificado
            if (valueA[criterio] && valueB[criterio]) {
                return String(valueA[criterio]).localeCompare(String(valueB[criterio]), "es", { sensitivity: "base" });
            }
            return 0; // Si no tienen el campo, no cambiar el orden
        });
        // Reconstruir el objeto ordenado
        return jsonOrdenado.reduce((obj, [clave, valor]) => {
            obj[clave] = valor;
            return obj;
        }, {});
    }
}

window.addEventListener("resize", checkFilters);
