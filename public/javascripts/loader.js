setTimeout(mostrarCarga, 40000);

function mostrarCarga() {
    document.getElementById("divLoader").style.display = 'none';
    document.getElementById("divContenido").style.display = 'block';
}

function descargarArchivos() {
    const downloadInstance = document.createElement('a');
    downloadInstance.href = '/files/News.docx';
    downloadInstance.target = '_blank';
    downloadInstance.download = 'News.docx';

    document.body.appendChild(downloadInstance);
    downloadInstance.click();
    document.body.removeChild(downloadInstance);
}

function cambiarPais(op) {
    var select = document.getElementById("selectPais"), //El <select>
        value = select.value, //El valor seleccionado
        text = select.options[select.selectedIndex].innerText; //El texto de la opción seleccionada 
    document.getElementById("opPais").value = text;
}

function cambiarIdioma() {
    var select = document.getElementById("selectIdioma"), //El <select>
        value = select.value, //El valor seleccionado
        text = select.options[select.selectedIndex].innerText; //El texto de la opción seleccionada 
    document.getElementById("opIdioma").value = text;
}

function cambiarCategoria() {
    var select = document.getElementById("selectCategoria"), //El <select>
        value = select.value, //El valor seleccionado
        text = select.options[select.selectedIndex].innerText; //El texto de la opción seleccionada 
    document.getElementById("opCategoria").value = text;
}

function bloquearBoton() {
    // const button = document.getElementById('btnEnviar');
    // button.addEventListener("click", function() {
    //     // Submit form
    // }, {once : true});


}

function enviarBoton(valor) {
    var id = valor.id;


    document.getElementById("divBtnDescarga_" + id).style.display = 'none';
    document.getElementById("divBtnCarga_" + id).style.display = 'block';

    var titulo = document.getElementById("hdTitle_" + id).value;
    var url = document.getElementById("hdUrl_" + id).value;
    var fecha = document.getElementById("hdPublishedAt_" + id).value;
    var descripcion = document.getElementById("hdDescription_" + id).value;
    var contenido = document.getElementById("hdContent_" + id).value;


    var parametros = {
        "titulo": titulo,
        "url": url,
        "fecha": fecha,
        "descripcion": descripcion,
        "contenido": contenido
    };

    $.ajax({
        data: parametros,
        url: "/downloadNew",
        type: "post",

        timeout: 5000,
        success: function (response) {
            console.log(response);
            //descargar el archivo

            setTimeout(() => {
                const downloadInstance = document.createElement('a');
                downloadInstance.href = '/files/New.docx';
                downloadInstance.target = '_blank';
                downloadInstance.download = 'New.docx';

                document.body.appendChild(downloadInstance);
                downloadInstance.click();
                document.body.removeChild(downloadInstance);


                document.getElementById("divBtnDescarga_" + id).style.display = 'block';
                document.getElementById("divBtnCarga_" + id).style.display = 'none';
            }, 5000);
        },

        error: function (xhr, textStatus, errorThrown) {

            if (textStatus == 'timeout') {
                alert(textStatus);
            }
        }
    });
}