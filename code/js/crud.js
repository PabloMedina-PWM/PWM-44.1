document.addEventListener("DOMContentLoaded", async function () {
    if (window.location.href.includes("crud_evento")) {
        await init('../templates/crud.html','crud_evento');
        const newSelectElement = document.getElementById("new-select");
        if (newSelectElement) {
            // Crear la instancia de Choices
            const myChoices = new Choices(newSelectElement, {
                removeItemButton: true,
                searchEnabled: true,
                placeholder: true,
                placeholderValue: "Selecciona los artistas...",
                noResultsText: "No se encontraron opciones",
                noChoicesText: "No hay más opciones disponibles",
                itemSelectText: "Presiona para seleccionar"
            });

            // **GUARDAR** la instancia en el propio elemento
            newSelectElement.choicesInstance = myChoices;
        } else {
            console.error("El elemento select con id 'new-select' no existe.");
        }
    }
});

async function changeContent(page, json) {

    document.querySelector('.crudTitle').textContent = json.titulo;

    changeTextContent(json);
    changePlaceHolders(json);
    hideRows(json);

    await specialChanges(json.especial[1], json);

    if (json.path[1] === "usuarios?correo=") {
        await chargeUserData(json);
    } else if (json.path[1] === "recintos?id=") {
        await chargeEnclosureData(json);
    } else if (json.path[1] === "artistas?id=") {
        await chargeArtistData(json);
    } else if (json.path[1] === "eventos?id=") {
        await chargeEventData(json);
    } else if (json.path[1] === "tareas?id=") {
        await chargeTaskData(json);
    }
}

function changeTextContent(json){
    if (json.cambiar[0] === 0) return;
    for (let i = 1; i <= json.cambiar[0]; i+=2){
        document.getElementById(json.cambiar[i]).textContent = json.cambiar[i+1];
    }
}

function changePlaceHolders(json){
    if (json.placeholders[0] === 0) return;
    for (let i = 1; i <= json.placeholders[0]; i+=2){
        document.getElementById(json.placeholders[i]).placeholder = json.placeholders[i+1];
    }
}

function hideRows(json){
    if (json.ocultar[0] === 0) return;
    for (let i = 1; i <= json.ocultar[0]; i++){
        document.querySelector(json.ocultar[i]).style.display = "none";
    }
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


async function specialChanges(page, json) {
    if (json.especial[0] === 0) return;

    let newJson = await getData(page);
    let newJson2 = await getData(json.especial[2]);

    if (!newJson || Object.keys(newJson).length === 0) {
        console.log("El JSON está vacío o es undefined.");
        return;
    }

    let select = document.getElementById("group");
    select.innerHTML = ""; // Limpiar el select antes de agregar nuevas opciones

    // Agregar opción por defecto
    let defaultOption = document.createElement("option");
    defaultOption.selected = true;
    defaultOption.id = "buscar grupo";
    defaultOption.textContent = json.placeholderSelector;
    defaultOption.value = ""; // IMPORTANTE: Asignar un valor para evitar problemas
    select.appendChild(defaultOption);

    // Agregar nuevas opciones desde newJson
    for (let i in newJson) {

        let option = document.createElement("option");
        option.value = newJson[i].id;
        if (json.especial[1] === "provincias") {
            option.textContent = i;
        }else{
            option.textContent = newJson[i].nombre;
        }
        select.appendChild(option);
    }

    if (json.especial[2] === "artistas") {
        let select2 = document.getElementById("new-select");
        if (!select2) return;

        // Asegúrate de que newJson2 tenga datos
        if (!newJson2 || !Array.isArray(newJson2) || newJson2.length === 0) return;

        // Recupera la instancia ya existente de Choices
        let choicesInstance = select2.choicesInstance || select2._choices;
        if (!choicesInstance) {
            console.error("No se encontró la instancia de Choices en new-select");
            return;
        }

        // Limpia las opciones previas
        choicesInstance.clearChoices();

        // Crea las nuevas opciones
        let newOptions = newJson2.map(item => ({
            value: item.id,
            label: item.nombre
        }));

        // Agrega las opciones a la instancia existente
        choicesInstance.setChoices(newOptions, "value", "label", true);

    }


    // Asegurar que el select tenga una opción válida seleccionada
    if (!select.value) {
        select.selectedIndex = 0;
    }
    return true;
}


async function chargeUserData(json) {
    try {
        let name;

        if (json.path[0] === "miperfil"){

            let userDataString = sessionStorage.getItem("currentUser");
            let userData = JSON.parse(userDataString);
            let userId = Object.keys(userData)[0]; // Obtiene la clave "5"
            name = userData[userId].correo; // Obtiene "Ana"

        } else{

            name = getUrlName('email');

        }


        let newJson = await getData(json.path[1]+name);



        if (newJson.length > 0) {
            let n = 0;// Verifica que haya datos antes de acceder a json[0]
            for (let i in newJson[0]) { // Verifica que haya datos antes de acceder a json[0]
                console.log(newJson[0][i]);
                document.getElementById(json.fills[n]).value = newJson[0][i];
                n++;
            }
        } else {
            console.warn("No se encontraron datos para el usuario.");
        }
    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }
}

async function chargeEnclosureData(json){
    try {
        let name;
        name = getUrlName('id');

        let newJson = await getData(json.path[1]+name);

        document.querySelector(".button").addEventListener("click", async (event) => {
            event.preventDefault();
            let index = 0;
            let campos = ["nombre", "direccion", "contacto", "capacidad"];
            let res = {};
            document.querySelectorAll("input").forEach(input => {
                if (input.parentElement.style.display !== "none") {
                    if (campos[index] !== "direccion") {
                        res[campos[index]] = input.value;
                    } else {
                        let provinciaIndex = document.getElementById("group").selectedIndex;
                        let provincia = document.getElementById("group").options[provinciaIndex].innerText;

                        res[campos[index]] = {
                            "nombre": input.value,
                            "provincia": provincia
                        }
                    }
                    index += 1;
                }
            });
            let resultado = {
                "nombre": res.nombre,
                "direccion": res.direccion,
                "capacidad": res.capacidad,
                "contacto": res.contacto
            }
            if (newJson.length > 0 && newJson[0].id !== undefined) {
                let url = "recintos/"
                url += newJson[0].id;
                updateData(url, resultado);
            } else {
                updateData("recintos", resultado);
            }
        });

        document.getElementById("delete-icon").addEventListener("click", function (event) {
            event.preventDefault();
            let url = json.titulo.toLowerCase() + "s/" + newJson[0].id;
            removeData(url);
        });


        let n = 0;
        for (let i in newJson[0]) {
            if (i === "id") continue;

            if (n === 1) {
                for (let j in newJson[0][i]) {

                    if (n === 1) {
                        let inputField = document.getElementById(json.fills[n]);
                        if (inputField) {
                            inputField.value = newJson[0][i][j];
                        } else {
                            console.warn("No se encontró el campo con ID:", json.fills[n]);
                        }
                    } else {
                        let select = document.getElementById("group");
                        if (select) {
                            let found = false;
                            for (let option of select.options) {
                                console.log("Comparando:", option.text, "con", newJson[0][i][j]);
                                if (option.text.trim().toLowerCase() === newJson[0][i][j].toString().trim().toLowerCase()) {
                                    option.selected = true;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                console.warn("No se encontró la opción en el select:", newJson[0][i][j]);
                            }
                        } else {
                            console.warn("No se encontró el select con ID 'group'");
                        }
                    }

                    n++;
                }


            }else{
                console.log(newJson[0][i]);
                document.getElementById(json.fills[n]).value = newJson[0][i];
                n++;
            }

        }

    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }
}

async function chargeArtistData(json){

    try {
        let name;

        name = getUrlName('id');

        let newJson = await getData(json.path[1]+name);

        document.querySelector(".button").addEventListener("click", async (event) => {
            event.preventDefault();
            let index = 0;
            let campos = ["nombre", "dirección", "teléfono", "email"];
            let res = {};
            document.querySelectorAll("input").forEach(input => {
                if (input.parentElement.style.display !== "none") {
                    if (index >= campos.length) {
                        res["grupo"] = input.value;
                    } else {
                        res[campos[index]] = input.value;
                    }

                    index += 1;
                }
            });

            let resultado = {
                "nombre": res.nombre,
                "dirección": res.dirección,
                "grupo": res.grupo,
                "teléfono": res.teléfono,
                "email": res.email,
                "eventos": []
            }
            if (newJson.length > 0 && newJson[0].id !== undefined) {
                let url = "artistas/"
                url += newJson[0].id;
                updateData(url, resultado);
            } else {
                updateData("artistas", resultado);
            }

        });

        document.getElementById("delete-icon").addEventListener("click", function (event) {
            event.preventDefault();
            let url = json.titulo.toLowerCase() + "s/" + newJson[0].id;
            removeData(url);
        });

        let n = 0;
        for (let i in newJson[0]) {
            if (i === "id") continue;
            console.log(newJson[0][i]);
            document.getElementById(json.fills[n]).value = newJson[0][i];
            n++;
        }

    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }

}

async function chargeEventData(json){

    try {
        let name;

        name = getUrlName('id');



        let newJson = await getData(json.path[1]+name);

        let nombre = newJson[0].nombre

        let newJson2 = await getData("artistas");

        document.querySelector(".button").addEventListener("click", async (event) => {
            event.preventDefault();
            let index = 0;
            let campos = ["nombre", "contacto", "fecha", "recinto", "tipo"];
            let res = {};
            document.querySelectorAll("input").forEach(input => {
                if (input.parentElement.style.display !== "none") {
                    res[campos[index]] = input.value;

                    index += 1;
                }
            });
            let recinto = document.getElementById("group")[document.getElementById("group").selectedIndex].innerText;
            let recintos = await getData("recintos");
            let provincia = "";
            for (let data in recintos) {
                if (recintos[data].nombre === recinto) {
                    provincia = recintos[data].direccion.provincia;
                    break;
                }
            }

            let selectorTipo = document.getElementById("province");
            let tipo = selectorTipo[selectorTipo.selectedIndex].innerText;
            let urlArtistas = "../html/artistas.html?evento=" + encodeURIComponent(newJson[0].nombre);
            let resultado = {
                "nombre": res.nombre,
                "recinto": {"nombre": recinto, "provincia": provincia},
                "contacto": res.contacto,
                "tipo": tipo,
                "fecha": res.fecha,
                "artistas": urlArtistas
            }
            let artistas = document.querySelector(".choices__input").choicesInstance.getValue();
            for (const choice of artistas) {
                let url = "artistas?nombre=" + encodeURIComponent(choice.label);
                getData(url).then(artista => {
                    let eventosUpdate = artista[0].eventos;
                    if (!(eventosUpdate.includes(resultado.nombre))) {
                        eventosUpdate.push(resultado.nombre);
                    }
                    updateData("artistas/" + artista[0].id, {
                        "eventos" : eventosUpdate
                    });
                });
            }
            for (let artist in newJson2) {
                if (newJson2[artist].eventos.includes(resultado.nombre)) {
                    let borrar = true;
                    for (const artista of artistas) {
                        if (artista.label === newJson2[artist].nombre) {
                            borrar = false;
                        }
                    }
                    if (borrar) {
                        const eventosUpdate = newJson2[artist].eventos.filter(item => item !== resultado.nombre);
                        updateData("artistas/" + newJson2[artist].id, {
                            "eventos" : eventosUpdate
                        });
                    }
                }
            }

            if (newJson.length > 0 && newJson[0].id !== undefined) {
                let url = "eventos/"
                url += newJson[0].id;
                updateData(url, resultado);
            } else {
                updateData("eventos", resultado);
            }
        });

        document.getElementById("delete-icon").addEventListener("click", function (event) {
            event.preventDefault();
            let url = json.titulo.toLowerCase() + "s/" + newJson[0].id;
            removeData(url);
        });

        for (let i in newJson2) {
            for (let j = 0; j < newJson2[i].eventos.length; j++) {

                if(newJson2[i].eventos[j] === nombre){
                    console.log(newJson2[i].eventos[j]);
                    let selectArtists = document.getElementById("new-select");
                    if (!selectArtists) return;

                    // Recuperar la instancia de Choices (debes haberla guardado antes)
                    let choicesInstance = selectArtists.choicesInstance;
                    if (!choicesInstance) {
                        console.warn("No se encontró la instancia de Choices en #new-select");
                        return;
                    }

                    // Agregar una nueva opción a la instancia
                    choicesInstance.setChoices(
                        [
                            {
                                value: newJson2[i].id,     // Valor del <option>
                                label: newJson2[i].nombre, // Texto del <option>
                                selected: true             // Marcar como seleccionado
                            }
                        ],
                        "value",
                        "label",
                        false
                    );


                }
            }
        }

        let n = 0;
        for (let i in newJson[0]) {
            if (n === 1) {
                for (let j in newJson[0][i]) {
                    if (n === 1) {
                        let select = document.getElementById("group");
                        if (select) {
                            let found = false;
                            for (let option of select.options) {
                                if (option.text.trim().toLowerCase() === newJson[0][i][j].toString().trim().toLowerCase()) {
                                    option.selected = true;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                console.warn("No se encontró la opción en el select:", newJson[0][i][j]);
                            }
                        } else {
                            console.warn("No se encontró el select con ID 'group'");
                        }
                        n++;
                    }


                }

            }else if (n !== 3 && n !== 4) {
                document.getElementById(json.fills[n]).value = newJson[0][i];
                n++;

            }else{
                if (n === 3){
                    let select = document.getElementById("province");
                    if (select) {
                        let found = false;
                        for (let option of select.options) {

                            console.log("Comparando:", option.text, "con", newJson[0][i]);
                            if (option.text.trim().toLowerCase() === newJson[0][i].toString().trim().toLowerCase()) {
                                option.selected = true;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            console.warn("No se encontró la opción en el select:", newJson[0][i]);
                        }
                    } else {
                        console.warn("No se encontró el select con ID 'group'");
                    }
                }else if(n === 4){
                    let select = document.getElementById("fecha"); // El ID del input de tipo date
                    if (select) {
                        let found = false;
                        let targetDate = newJson[0][i];  // Fecha en formato 'yyyy-mm-dd' (o del array en tu estructura)

                        console.log("Comparando:", select.value, "con", targetDate);
                        select.value = targetDate;  // Seleccionamos la fecha
                        found = true;


                        if (!found) {
                            console.warn("No se encontró la fecha en el input:", targetDate);
                        }
                    } else {
                        console.warn("No se encontró el input con ID 'fecha'");
                    }
                }

                n++;
            }
        }

    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }

    return true;
}

async function chargeTaskData(json){

    try {
        let id;

        id = getUrlName('id');


        let newJson = await getData(json.path[1]+id);

        document.querySelector(".button").addEventListener("click", async (event) => {
            event.preventDefault();
            let index = 0;
            let campos = ["nombre", "descripcion", "prioridad"];
            let res = {};
            document.querySelectorAll("input").forEach(input => {
                if (input.parentElement.style.display !== "none" && input.id !== "n-task") {
                    res[campos[index]] = input.value;
                    index += 1;
                }
            });

            let resultado = {
                "nombre": res.nombre,
                "descripcion": res.descripcion,
                "prioridad": res.prioridad,
                "empleado": document.getElementById("group").value
            }
            if (newJson.length > 0 && newJson[0].id !== undefined) {
                let url = "tareas/"
                url += newJson[0].id;
                updateData(url, resultado);
            } else {
                updateData("tareas", resultado);
            }

        });

        document.getElementById("delete-icon").addEventListener("click", function (event) {
            event.preventDefault();
            let url = json.titulo.toLowerCase() + "s/" + newJson[0].id;
            removeData(url);
        });

        let n = 0;

        for (let i in newJson[0]) {
            if (n <= 2) {
                console.log(newJson[0][i]);
                document.getElementById(json.fills[n]).value = newJson[0][i];

            }else if (n === 3) {
                let select = document.getElementById("group");
                if (select) {
                    let found = false;
                    for (let option of select.options) {

                        console.log("Comparando:", option.text, "con", newJson[0][i]);
                        if (option.text.trim().toLowerCase() === newJson[0][i].toString().trim().toLowerCase()) {
                            option.selected = true;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        console.warn("No se encontró la opción en el select:", newJson[0][i]);
                    }
                } else {
                    console.warn("No se encontró el select con ID 'group'");
                }
            } else if (n === 7) {
                document.getElementById(json.fills[4]).value = newJson[0][i];
            } else if (n===4){
                let select = document.getElementById("fecha"); // El ID del input de tipo date
                if (select) {
                    let found = false;
                    let targetDate = newJson[0][i];  // Fecha en formato 'yyyy-mm-dd' (o del array en tu estructura)

                    console.log("Comparando:", select.value, "con", targetDate);
                    select.value = targetDate;  // Seleccionamos la fecha
                    found = true;


                    if (!found) {
                        console.warn("No se encontró la fecha en el input:", targetDate);
                    }
                } else {
                    console.warn("No se encontró el input con ID 'fecha'");
                }
            }

            n++;

        }

function removeData(place) {
    let url = "http://localhost:3000/" + place;
    fetch (url, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
    }).then(function (response) {
        return response.json();
    }).catch(function (error) {
        console.error("Error al cargar los datos: ", error);
    });
}
    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }

}



}


function getUrlName(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name); // Retorna el valor de 'empleado' en la URL
}

function updateData(place, data) {
    let route = place.split("/");
    let met;
    if (route.length > 1) {
        met = 'PATCH';
    } else {
        met = 'POST';
    }
    let url = "http://localhost:3000/" + place;
    fetch (url, {
        method: met,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function (response) {
        return response.json();
    }).catch(function (error) {
        console.error("Error al cargar los datos: ", error);
    });


