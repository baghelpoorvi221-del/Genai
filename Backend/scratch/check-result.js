const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function testResult() {
    try {
        console.log("Calling generateContent...");
        const result = await ai.models.generateContent({
            model: "models/gemini-2.0-flash",
            contents: "Hello",
        });
        console.log("Result keys:", Object.keys(result));
        if (result.response) {
            console.log("Response keys:", Object.keys(result.response));
        } else {
             console.log("Response is UNDEFINED");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testResult();
