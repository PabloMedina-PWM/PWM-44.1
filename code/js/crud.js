
function changeContent(type){
    switch (type) {
        case 'crudArtista':
            document.querySelector('.crudTitle').textContent = "Artista";
            document.getElementById('surnames').textContent = "Apellidos";
            document.getElementById('address').placeholder = "Apellidos";
            document.querySelector('.c-n-task').style.display = "none";
            document.querySelector('.c-password').style.display = "none";
            document.querySelector('.c-province').style.display = "none";
            break;

        case 'crudEmpleado':
            document.querySelector('.crudTitle').textContent = "Empleado";
            document.getElementById('surnames').textContent = "Apellidos";
            document.getElementById('address').placeholder = "Apellidos";
            document.querySelector('.c-n-task').style.display = "none";
            document.querySelector('.c-province').style.display = "none";
            break;

    }
}
