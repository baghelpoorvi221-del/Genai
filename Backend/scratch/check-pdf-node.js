async function test() {
    try {
        console.log("Testing require('pdf-parse/node')...");
        const pdf = require("pdf-parse/node");
        console.log("pdf-parse/node type:", typeof pdf);
        if (typeof pdf === 'function') {
            console.log("It is a function!");
        } else {
            console.log("Properties:", Object.keys(pdf));
        }
    } catch (e) {
        console.log("Error requiring pdf-parse/node:", e.message);
    }
}
test();
