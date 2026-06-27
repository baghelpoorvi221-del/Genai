const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function testGenerate() {
    try {
        console.log("Testing with gemini-flash-latest...");
        const result = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: "Say hello",
        });
        console.log("Success!");
        console.log("Result text:", result.response.text());
    } catch (e) {
        console.error("Error with gemini-flash-latest:", e.message);
        
        console.log("\nTesting with gemini-1.5-flash...");
        try {
            const result2 = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: "Say hello",
            });
            console.log("Success with gemini-1.5-flash!");
        } catch (e2) {
            console.error("Error with gemini-1.5-flash:", e2.message);
        }
    }
}

testGenerate();
