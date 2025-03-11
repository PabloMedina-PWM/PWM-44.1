async function changeContent(page) {
    switch(page) {
        case "eventos":
            document.getElementById("titulo1").innerText = "Eventos";
            document.getElementById("prioridad").style.display = "none";
            document.getElementById("empleado").options[0].text = "Recinto";

    }
}