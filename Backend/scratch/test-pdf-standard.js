const pdf = require("pdf-parse");
const fs = require('fs');
const path = require('path');

async function testPdf() {
    try {
        const buffer = fs.readFileSync(path.join(__dirname, '../resume.pdf'));
        console.log("Testing standard pdf-parse usage...");
        const data = await pdf(buffer);
        console.log("Success!");
        console.log("Text length:", data.text?.length);
        console.log("First 100 chars:", data.text?.substring(0, 100));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testPdf();
