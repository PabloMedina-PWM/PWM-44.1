async function changeContent(page, json) {

    document.getElementById("titulo1").innerText = json.titulo;

    for (let i = 0; i < json.nFilas; i++) {
        let jsonfila = "fila" + (i + 1);
        let fila = json[jsonfila];
        let tr = addRow(fila["col1"], fila["col2"], fila["col3"], fila["col4"], json.textoBotonTabla);
        document.getElementById("table-viewer").getElementsByTagName("tbody")[0].appendChild(tr);
    }

    json.columnasAOcultar.forEach(columna => {
        document.querySelectorAll(columna).forEach(e => e.style.display = "none");
    });
    for (let i=0; i<=json.columnas.length; i++) {
        let nombre = "heading" + (i+1);
        document.getElementById(nombre).innerText = json.nombreColumnas[i];
    }
    for (let i = 1; i < json.filtros+1; i++) {
        let filtro = "filtro" + i;
        document.getElementById(filtro).options[0].text = json.nombreFiltros[i-1];
    }
    for (let i = 3; i > json.filtros; i--) {
        let filtro = "filtro" + i;
        document.getElementById(filtro).style.display = "none";
    }
    document.querySelectorAll(".button_colum").forEach(e => {
        e.textContent = json.textoBotonTabla;
        e.onclick = function () {
            window.location.href = json.enlaceBotonTabla;
        }
    });

    document.getElementById("add-button").innerText = json.textoBotonAñadir;
    document.getElementById("add-button").onclick = function () {
        window.location.href = json.enlaceBotonAñadir;
    }
}

function addRow(col1, col2, col3, col4, col5) {
    let tr = document.createElement("tr");

    let colValues = [col1, col2, col3, col4];
    colValues.forEach((value, index) => {
        let td = document.createElement("td");
        td.innerText = value;
        td.className = `col${index + 1}`; // Asigna la clase correspondiente
        tr.appendChild(td);
    });

    if (col5 != null) {
        let buttonTd = document.createElement("td");
        buttonTd.className = "col4";
        let button = document.createElement("button");
        button.className = "button_colum";
        buttonTd.appendChild(button);
        tr.appendChild(buttonTd);
    }


    return tr;
}