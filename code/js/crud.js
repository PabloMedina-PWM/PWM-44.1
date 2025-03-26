
async function changeContent(page, json) {

    document.querySelector('.crudTitle').textContent = json.titulo;

    changeTextContent(json);
    changePlaceHolders(json);
    hideRows(json);
    await specialChanges(json.especial[1], json);

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
    select.appendChild(defaultOption);

    // Agregar nuevas opciones desde newJson
    for (let i in newJson) {
        let option = document.createElement("option");
        option.value = newJson[i].id; // Se asume que cada objeto en newJson tiene un ID
        option.textContent = i; // Se asume que tiene un campo 'nombre'
        select.appendChild(option);
    }
}



