async function changeContent(page, json) {
    if (sessionStorage.getItem("currentUser") !== null) {
        window.location.href = "../html/dashboard.html";
        return
    }
    document.getElementById("text-main-superior").innerHTML = json.Titulo1;
    document.getElementById("text-main-inferior").innerHTML = json.Titulo2;
    document.getElementById("email/newpassword").placeholder = json.Place1;
    document.getElementById("password/description").placeholder = json.Place2;
    document.getElementById("main-button").innerHTML = json.Button;
    const input = document.getElementById('password/description');
    const input2 = document.getElementById('email/newpassword');
    input.style.fontSize = '2rem';
    input.style.textAlign = 'left';
    input2.style.fontSize = '2rem';
    input2.style.textAlign = 'left';
    document.getElementById("logoPhoto").href = "";
    document.querySelectorAll(".unauthhide").forEach((element) => {
        element.style.display = 'none';
    });
    let currentPage = window.location.pathname;

    if (!currentPage.includes("index.html")) {
        document.querySelector(".link_password").style.display = "none";
    }

    if (currentPage.includes("restablecer_contrasena.html")) {
        document.querySelector(".link_password").style.display = "none";
        document.getElementById("email/newpassword").type = 'password';
        document.getElementById("password/description").type = 'password';
    }

    if (currentPage.includes("soporte_tecnico.html")) {
        document.querySelector("#support-title").style.display = "block";
        document.querySelector("#support-title").style.marginTop = "20rem";
        document.getElementById("text-main-superior").style.fontSize = '1.5rem';
        document.getElementById("text-main-inferior").style.fontSize = '1.5rem';
        document.getElementById("email/newpassword").type = 'text';
        document.getElementById("password/description").type = 'text';
        const buttonContainer = document.querySelector('.button-container');
        buttonContainer.style.display = 'flex';
        input.style.height = '7rem';
        input2.style.height = '2.5rem';
        input.style.fontSize = '1rem';
        input.style.textAlign = 'left';
        input2.style.fontSize = '1rem';
        input2.style.textAlign = 'left';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        document.getElementById("main-button").style.width = '100%';
    }

    if (currentPage.includes("correo_recuperacion.html")) {
        document.getElementById("password/description").type = 'email';
        document.getElementById("email/newpassword").style.display = "none";
        document.getElementById("text-main-superior").style.fontSize = '1.45rem'
        document.getElementById("text-main-superior").style.marginBottom = '3rem';
        document.getElementById("main-button").style.width = '100%';
        input2.type = "password"
    }

    if (currentPage.includes("index.html")) {
        document.getElementById("login-form").addEventListener("submit", async function (event) {
            event.preventDefault();
            let email = document.getElementById("email/newpassword").value;
            let password = document.getElementById("password/description").value;
            await login(email, password);
        });
    }

}


async function login(email, password) {
    let datos = await getData("usuarios");
    for (let account in datos) {
        if (email === datos[account].correo && password === datos[account].password) {
            sessionStorage.setItem("currentUser", JSON.stringify({[account]:datos[account]}));
            window.location.href = "../html/dashboard.html";
        } else {
            alert("El correo o la contraseña no son correctos.")
        }
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
