
async function changeContent(page, json) {

    document.querySelector('.crudTitle').textContent = json.titulo;


    changeTextContent(json);
    changePlaceHolders(json);
    hideRows(json);

    await specialChanges(json.especial[1], json);
    if (json.path[1] === "usuarios?nombre=") {
        await chargeUserData(json);
    } else if (json.path[1] === "recintos?nombre=") {
        await chargeEnclosureData(json);
    } else if (json.path[1] === "artistas?nombre=") {
        await chargeArtistData(json);
    } else if (json.path[1] === "eventos?nombre=") {
        await chargeEventData(json);
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
        option.textContent = i;
        select.appendChild(option);
    }

    // Asegurar que el select tenga una opción válida seleccionada
    if (!select.value) {
        select.selectedIndex = 0;
    }
}



async function chargeUserData(json) {
    try {
        let name;

        if (json.path[0] === "miperfil"){

            let userDataString = sessionStorage.getItem("currentUser");
            let userData = JSON.parse(userDataString);
            let userId = Object.keys(userData)[0]; // Obtiene la clave "5"
            name = userData[userId].nombre; // Obtiene "Ana"

        } else{

            name = getUrlName('empleado');

        }

        let newJson = await getData(json.path[1]+name);

        if (newJson.length > 0) {
            let n = 0;// Verifica que haya datos antes de acceder a json[0]
            for (let i in newJson[0]) { // Verifica que haya datos antes de acceder a json[0]
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

        name = getUrlName('recinto');

        let newJson = await getData(json.path[1]+name);

        document.getElementById("name").value = name;

        let n = 0;
        for (let i in newJson[name]) {
            if (n === 0) {
                for (let j in newJson[name][i]) {
                    console.log("Valor actual:", newJson[name][i][j]);

                    if (n === 0) {
                        let inputField = document.getElementById(json.fills[n]);
                        if (inputField) {
                            inputField.value = newJson[name][i][j];
                        } else {
                            console.warn("No se encontró el campo con ID:", json.fills[n]);
                        }
                    } else {
                        let select = document.getElementById("group");
                        if (select) {
                            let found = false;
                            for (let option of select.options) {
                                console.log("Comparando:", option.text, "con", newJson[name][i][j]);
                                if (option.text.trim().toLowerCase() === newJson[name][i][j].toString().trim().toLowerCase()) {
                                    option.selected = true;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                console.warn("No se encontró la opción en el select:", newJson[name][i][j]);
                            }
                        } else {
                            console.warn("No se encontró el select con ID 'group'");
                        }
                    }

                    n++;
                }


            }else{
                console.log(newJson[name][i]);
                document.getElementById(json.fills[n]).value = newJson[name][i];
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

        name = getUrlName('artista');

        let newJson = await getData(json.path[1]+name);

        document.getElementById("name").value = name;

        let n = 0;
        for (let i in newJson[name]) {
            console.log(newJson[name][i]);
            document.getElementById(json.fills[n]).value = newJson[name][i];
            n++;
        }

    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }

}

async function chargeEventData(json){

    try {
        let name;

        name = getUrlName('evento');

        let newJson = await getData(json.path[1]+name);

        console.log(newJson);

        document.getElementById("name").value = name;

        /*let n = 0;
        for (let i in newJson[name]) {
            console.log(newJson[name][i]);
            document.getElementById(json.fills[n]).value = newJson[name][i];
            n++;
        }*/

    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }

}


function getUrlName(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name); // Retorna el valor de 'empleado' en la URL
}



