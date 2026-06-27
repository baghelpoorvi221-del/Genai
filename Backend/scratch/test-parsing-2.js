const { PDFParse } = require("pdf-parse");
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const buffer = fs.readFileSync(path.join(__dirname, '../resume.pdf'));
        console.log("Instantiating PDFParse...");
        const instance = new PDFParse(buffer);
        
        console.log("Methods on instance:", Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
        
        // Let's try some common method names
        if (typeof instance.getText === 'function') {
            console.log("Calling getText()...");
            const text = await instance.getText();
            console.log("Text:", text.substring(0, 50));
        } else if (typeof instance.parse === 'function') {
             console.log("Calling parse()...");
             const data = await instance.parse();
             console.log("Data text:", data.text?.substring(0, 50));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
