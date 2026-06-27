const pdf = require("pdf-parse");
console.log("pdf.PDFParse type:", typeof pdf.PDFParse);
if (typeof pdf.PDFParse === 'function') {
    console.log("Is PDFParse a class? ", pdf.PDFParse.toString().startsWith('class'));
}
