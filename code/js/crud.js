
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



        let n = 0;
        for (let i in newJson[0]) {

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

        let n = 0;
        for (let i in newJson[0]) {
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
            }

            n++;

        }

    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
    }




}


function getUrlName(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name); // Retorna el valor de 'empleado' en la URL
}



