const pdf = require("pdf-parse").PDFParse;
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const buffer = fs.readFileSync(path.join(__dirname, '../resume.pdf'));
        // Try with new
        console.log("Trying with new PDFParse()...");
        const pdfData = await new pdf(buffer);
        console.log("Success! Keys:", Object.keys(pdfData));
        console.log("Text snippet:", pdfData.text?.substring(0, 50));
    } catch (e) {
        console.error("Failed with new:", e.message);
        
        try {
            console.log("Trying the default export as function...");
            const pdfFunc = require("pdf-parse");
            const data = await pdfFunc(buffer);
            console.log("Success with default export!");
        } catch (e2) {
            console.error("Failed with default export:", e2.message);
        }
    }
}

test();
