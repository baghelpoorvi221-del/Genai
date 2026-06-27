const pdf = require("pdf-parse");
console.log("Exports of pdf-parse:", Object.keys(pdf));

try {
    const pdfNode = require("pdf-parse/node");
    console.log("Exports of pdf-parse/node:", Object.keys(pdfNode));
} catch (e) {
    console.log("Could not require pdf-parse/node");
}
