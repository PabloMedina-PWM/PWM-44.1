function loadTemplate(fileName, id, callback) {

    fetch(fileName).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById(id).innerHTML = text;
        if(callback){
            callback();
        }
    })
}


function init(route) {
    loadTemplate('../templates/header.html', 'main_header');
    loadTemplate(route.toString(), 'main_section');
    loadTemplate('../templates/footer.html', 'main_footer');

}