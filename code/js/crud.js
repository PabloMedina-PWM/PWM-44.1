
function setChanges(type){
    switch (type) {
        case 'artista':
            document.querySelector('.crudTitle').textContent = "Artista";
            break;
    }
}

function changer(type) {
    setChanges(type);
}