async function changeContent(page, json) {
    document.getElementById("titulo1").innerText = json.titulo;
    json.columnasAOcultar.forEach(columna => {
        console.log(columna);
        document.querySelectorAll(columna).forEach(e => e.style.display = "none");
    });
    for (i=0; i<=json.columnas.length; i++) {
        document.querySelectorAll(json.columnas[i]).forEach(e => {
            e.innerText = json.nombreColumnas[i];
        });
    }
    for (i = 1; i < json.filtros+1; i++) {
        let filtro = "filtro" + i;
        console.log(filtro)
        document.getElementById(filtro).options[0].text = json.nombreFiltros[i-1];
    }
    for (i = 3; i > json.filtros; i--) {
        let filtro = "filtro" + i;
        document.getElementById(filtro).style.display = "none";
    }

}