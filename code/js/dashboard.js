async function changeContent(page, json) {
    document.getElementById("Title").innerText = json.Titulo1;
    document.getElementById("task").innerText = json.Titulo2;
    document.getElementById("events").innerText = json.Titulo3;
    await obtenerTareasUsuario();
    await obtenerEventos();  // Llamamos a la nueva función para los eventos

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

// Función para mostrar las tareas en la interfaz
function displayTareas(tareas) {
    const tareasTableBody = document.getElementById("tasksTableBody");
    tareasTableBody.innerHTML = "";  // Limpiar el contenedor antes de mostrar las tareas

    if (tareas.length > 0) {
        tareas.forEach(tarea => {
            let tr = document.createElement("tr");

            // Nombre de la tarea
            let td1 = document.createElement("td");
            td1.innerText = tarea.nombre;  // Ajusta según el campo real en tu JSON
            tr.appendChild(td1);

            // Prioridad de la tarea
            let td2 = document.createElement("td");
            td2.innerText = tarea.descripcion;  // Ajusta según el campo real en tu JSON
            tr.appendChild(td2);

            // Fecha límite de la tarea
            let td3 = document.createElement("td");
            td3.innerText = tarea.prioridad;  // Ajusta según el campo real en tu JSON
            tr.appendChild(td3);

            // Descripción de la tarea
            let td4 = document.createElement("td");
            td4.innerText = tarea.fecha;  // Agregar la descripción de la tarea
            tr.appendChild(td4);

            // Agregar un evento de clic a la fila de la tarea para redirigir
            tr.addEventListener('click', () => {
                // Redirigir a la página de tareas con el filtro por ID y correo del usuario
                window.location.href = `../html/tareas.html?emailEmpleado=${tarea.emailEmpleado}&idTarea=${tarea.id}`;
            });

            // Agregar la fila al tbody de la tabla
            tareasTableBody.appendChild(tr);
        });
    } else {
        // Si no hay tareas, mostrar un mensaje
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 4;  // Actualizar a 4 columnas, ya que ahora tenemos una columna más
        td.innerText = "No hay tareas asignadas a este usuario.";
        tr.appendChild(td);
        tareasTableBody.appendChild(tr);
    }
}

async function obtenerEventos() {
    let eventsJson = await getData("eventos?nombres");  // Llamada al backend para obtener los eventos
    console.log(eventsJson);  // Verifica que recibimos los eventos correctamente

    if (eventsJson && eventsJson.length > 0) {
        displayEventos(eventsJson);  // Si los eventos existen, los mostramos
    } else {
        console.log("No hay eventos disponibles.");
    }
}

// Función para mostrar los eventos en la tabla
function displayEventos(eventos) {
    const eventsTableBody = document.getElementById("eventsTableBody");  // Obtén el cuerpo de la tabla

    if (!eventsTableBody) {
        console.error("No se encuentra el contenedor de la tabla.");
        return;
    }

    eventsTableBody.innerHTML = "";  // Limpiar la tabla antes de agregar los nuevos eventos

    if (eventos.length > 0) {
        eventos.forEach(evento => {
            let tr = document.createElement("tr");

            // Crear celda para el nombre del evento
            let td1 = document.createElement("td");
            td1.innerText = evento.nombre;  // Nombre del evento
            tr.appendChild(td1);

            // Crear celda para el recinto
            let td2 = document.createElement("td");
            td2.innerText = evento.recinto.nombre;  // Nombre del recinto
            tr.appendChild(td2);

            // Crear celda para la fecha
            let td3 = document.createElement("td");
            td3.innerText = evento.fecha;  // Fecha del evento
            tr.appendChild(td3);

            // Agregar la fila de evento a la tabla
            eventsTableBody.appendChild(tr);
        });
    } else {
        // Si no hay eventos, mostrar un mensaje
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 3;  // Esta celda ocupará todas las columnas
        td.innerText = "No hay eventos disponibles en este momento.";
        tr.appendChild(td);
        eventsTableBody.appendChild(tr);
    }
}