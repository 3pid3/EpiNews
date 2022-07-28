setTimeout(mostrarCarga, 40000);

function mostrarCarga(){
    document.getElementById("divLoader").style.display = 'none';
    document.getElementById("divContenido").style.display = 'block';
}

function descargarArchivos(){
    const downloadInstance = document.createElement('a');
    downloadInstance.href = '/files/News.docx';
    downloadInstance.target = '_blank';
    downloadInstance.download = 'News.docx';

    document.body.appendChild(downloadInstance);
    downloadInstance.click();
    document.body.removeChild(downloadInstance);
}

function cambiarPais(op){
    var select = document.getElementById("selectPais"), //El <select>
    value = select.value, //El valor seleccionado
    text = select.options[select.selectedIndex].innerText; //El texto de la opción seleccionada 
    document.getElementById("opPais").value = text;
}

function cambiarIdioma(){
    var select = document.getElementById("selectIdioma"), //El <select>
    value = select.value, //El valor seleccionado
    text = select.options[select.selectedIndex].innerText; //El texto de la opción seleccionada 
    document.getElementById("opIdioma").value = text;
}

function cambiarCategoria(){
    var select = document.getElementById("selectCategoria"), //El <select>
    value = select.value, //El valor seleccionado
    text = select.options[select.selectedIndex].innerText; //El texto de la opción seleccionada 
    document.getElementById("opCategoria").value = text;
}