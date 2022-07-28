var express = require('express');
var router = express.Router();
const fs = require('fs');
const pkg = require('docx');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = pkg;
// we need axios to make HTTP requests
const axios = require('axios');

// and we need jsdom and Readability to parse the article HTML
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

const toDay = new Date();
const fechaN = toDay.toLocaleString("es-MX", { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: "America/Monterrey" });
const fechaNu = fechaN.split(/[-/]/).reverse().join("-");

var fechaActual = fechaNu;

let titulo;

var array = [];
var consulta = "";
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'News' });
});

router.get('/downloadFile', function (req, res, next) {
  res.render('downloadFile', { title: 'Download' });
});

router.post('/downloadFile', function (req, res) {
  //res.send(req.body);
  array = [];
  console.log(req.body);
  if (req.body.selectPais != "") {
    consulta = "&country=" + req.body.selectPais;
  }

  if (req.body.selectIdioma != "") {
    consulta += "&language=" + req.body.selectIdioma;
  }

  if (req.body.selectCategoria != "") {
    consulta += "&category=" + req.body.selectCategoria;
  }

  if (req.body.txtPalabra != "") {
    consulta += "&q=" + req.body.txtPalabra;
  }

  let url = 'https://newsapi.org/v2/top-headlines?pageSize=100' + consulta + '&apiKey=b7767b490e2b4184bd68896e9ddc92af';

  console.log(url);
  // Make the request with axios' get() function
  axios.get(url).then(function (r1) {
    let firstResult;

    for (let i = 0; i < r1.data.articles.length; i++) {
      //console.log(r1.data.articles[i]['publishedAt']);
      fecha = r1.data.articles[i]['publishedAt'].split('T');
      //console.log(fechaActual +" == "+fecha[0]);
      if (fechaActual == fecha[0]) {
        //console.log("ingreso");
        // At this point we will have some search results from the API. Take the first search result...
        firstResult = r1.data.articles[i];

        //// ...and download the HTML for it, again with axios
        axios.get(firstResult.url).then(function (r2) {
          //// We now have the article HTML, but before we can use Readability to locate the article content we need jsdom to convert it into a DOM object
          let dom = new JSDOM(r2.data, {
            url: firstResult.url
          });

          //// now pass the DOM document into readability to parse
          let article = new Readability(dom.window.document).parse();
          // we create a array with all information
          titulo = {
            'titulo': r1.data.articles[i]['title'], 'url': r1.data.articles[i]['url'], 'fecha': r1.data.articles[i]['publishedAt'],
            'descripcion': r1.data.articles[i]['description'], 'resumen': r1.data.articles[i]['content'], 'contenido': article.textContent.trim()
          };
          array.push(titulo);
        }).catch(function (error) {
          titulo = {
            'titulo': r1.data.articles[i]['title'], 'url': r1.data.articles[i]['url'], 'fecha': r1.data.articles[i]['publishedAt'],
            'descripcion': r1.data.articles[i]['description'], 'resumen': r1.data.articles[i]['content'], 'contenido': 'ERROR_LOG ' + error
          };
          array.push(titulo);
        })
      }
    }

    setTimeout(mostrar, 30000);
  }).catch(function (error) {
    console.log("Error_log");
  })

  res.redirect('/downloadFile');
});

module.exports = router;

function mostrar() {
  // Documents contain sections, you can have multiple sections per document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...array.map((artl) => {
            const arr = [];

            arr.push(createParagraphTitle(artl.titulo));
            arr.push(createParagraphUrl(artl.url));
            arr.push(createParagraphFecha(artl.fecha));
            arr.push(createParagraphDescripcion(artl.descripcion));
            arr.push(createParagraphResumen(artl.resumen));
            arr.push(createParagraphContenido(artl.contenido));

            return arr;
          })
            .reduce((prev, curr) => prev.concat(curr), []),
        ],
      },
    ],
  });

  // Used to export the file into a .docx file
  Packer.toBuffer(doc).then((buffer) => {

    try {
      if (!fs.existsSync('public/files')) {
        console.log("no existe");
        fs.mkdirSync('public/files');
      } else {
        console.log("existe");
      }
      fs.writeFileSync("public/files/News.docx", buffer);
    } catch (err) {

      console.log(err);
    }


  });
}

//functions to add a new paragraph
function createParagraphTitle(encabezado) {
  return new Paragraph({
    children: [
      new TextRun({
        text: encabezado,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.JUSTIFIED,
    spacing: {
      before: 240,
    },
  });
}

function createParagraphUrl(url) {
  return new Paragraph({
    children: [
      new TextRun({
        text: url,
        italics: true,
        bold: true,
      }),
    ],
    alignment: AlignmentType.JUSTIFIED,
  });
}

function createParagraphFecha(fecha) {
  return new Paragraph({
    children: [
      new TextRun({
        text: "FECHA: ",
        bold: true,
      }),
      new TextRun({
        text: fecha,
      }),
    ],
    alignment: AlignmentType.JUSTIFIED,
  });
}

function createParagraphDescripcion(descripcion) {
  return new Paragraph({
    children: [
      new TextRun({
        text: "DESCRIPCIÓN: ",
        bold: true,
      }),
      new TextRun({
        text: descripcion,
      }),
    ],
    alignment: AlignmentType.JUSTIFIED,
  });
}

function createParagraphResumen(resumen) {
  return new Paragraph({
    children: [
      new TextRun({
        text: "RESUMEN: ",
        bold: true,
      }),
      new TextRun({
        text: resumen,
      }),
    ],
    alignment: AlignmentType.JUSTIFIED,
  });
}

function createParagraphContenido(contenido) {
  return new Paragraph({
    children: [
      new TextRun({
        text: "CONTENIDO: ",
        bold: true,
      }),
      new TextRun({
        text: contenido,
      }),
    ],
    alignment: AlignmentType.JUSTIFIED,
  });
}
