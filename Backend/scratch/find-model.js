const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function findModel() {
    try {
        const response = await ai.models.list();
        const models = response.pageInternal || [];
        const names = models.map(m => m.name);
        console.log("Names:", names);
        if (names.includes("models/gemini-1.5-flash")) {
            console.log("Found 1.5-flash!");
        } else {
            console.log("1.5-flash NOT found.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

findModel();
