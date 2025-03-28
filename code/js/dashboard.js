async function changeContent(page, json) {
    document.getElementById("Title").innerText = json.Titulo1;
    document.getElementById("task").innerText = json.Titulo2;
    document.getElementById("events").innerText = json.Titulo3;
    await obtenerTareasUsuario();
    await obtenerEventos();

}

async function obtenerTareasUsuario() {
    let userDataString = sessionStorage.getItem("currentUser");
    if (userDataString) {
        let userData = JSON.parse(userDataString);
        let accountKey = Object.keys(userData)[0];
        let user = userData[accountKey];

        console.log("Usuario logueado:", user.nombre);
        let userEmail = user.correo.trim();
        console.log("Correo del usuario logueado:", userEmail);

        let newJson = await getData("tareas?emailEmpleado");
        if (newJson && newJson.length > 0) {
            let emailsTareas = newJson.map(tarea => tarea.emailEmpleado.trim());
            console.log("Correos de las tareas:", emailsTareas);

            let tareasUsuario = newJson.filter(tarea => tarea.emailEmpleado.trim() === userEmail);

            if (tareasUsuario.length > 0) {
                console.log("Tareas asignadas al usuario:", tareasUsuario);
                displayTareas(tareasUsuario);
            } else {
                console.log("El usuario no tiene tareas asignadas.");
                displayTareas([]);
            }
        }
    } else {
        console.error("No se encontró el usuario en sessionStorage.");
    }
}

async function getData(page) {
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

function displayTareas(tareas) {
    const tareasTableBody = document.getElementById("tasksTableBody");
    tareasTableBody.innerHTML = "";

    if (tareas.length > 0) {
        tareas.forEach(tarea => {
            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.innerText = tarea.nombre;
            tr.appendChild(td1);

            let td2 = document.createElement("td");
            td2.innerText = tarea.descripcion;
            tr.appendChild(td2);

            let td3 = document.createElement("td");
            td3.innerText = tarea.prioridad;
            tr.appendChild(td3);

            let td4 = document.createElement("td");
            td4.innerText = tarea.fecha;
            tr.appendChild(td4);

            tr.addEventListener('click', () => {
                window.location.href = `../html/tareas.html?emailEmpleado=${tarea.emailEmpleado}&idTarea=${tarea.id}`;
            });
            tareasTableBody.appendChild(tr);
        });
    } else {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 4;
        td.innerText = "No hay tareas asignadas a este usuario.";
        tr.appendChild(td);
        tareasTableBody.appendChild(tr);
    }
}

async function obtenerEventos() {
    let eventsJson = await getData("eventos?nombres");
    console.log(eventsJson);

    if (eventsJson && eventsJson.length > 0) {
        let filteredEvents = filterEventsByDate(eventsJson);

        if (filteredEvents.length > 0) {
            displayEventos(filteredEvents);
        } else {
            console.log("No hay eventos dentro del rango de fechas.");
        }
    } else {
        console.log("No hay eventos disponibles.");
    }
}

function filterEventsByDate(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    oneMonthLater.setHours(23, 59, 59, 999);

    return events.filter(event => {
        const eventDate = new Date(event.fecha);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate >= today && eventDate <= oneMonthLater;
    });
}


function displayEventos(eventos) {
    const eventsTableBody = document.getElementById("eventsTableBody");

    if (!eventsTableBody) {
        console.error("No se encuentra el contenedor de la tabla.");
        return;
    }

    eventsTableBody.innerHTML = "";

    if (eventos.length > 0) {
        eventos.forEach(evento => {
            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.innerText = evento.nombre;
            tr.appendChild(td1);

            let td2 = document.createElement("td");
            td2.innerText = evento.recinto.nombre;
            tr.appendChild(td2);

            let td3 = document.createElement("td");
            td3.innerText = evento.fecha;
            tr.appendChild(td3);

            eventsTableBody.appendChild(tr);
        });
    } else {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 3;
        td.innerText = "No hay eventos disponibles en este momento.";
        tr.appendChild(td);
        eventsTableBody.appendChild(tr);
    }
}