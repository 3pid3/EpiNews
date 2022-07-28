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