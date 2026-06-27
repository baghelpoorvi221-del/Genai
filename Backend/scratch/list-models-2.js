const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function listModels() {
    try {
        console.log("Listing models...");
        const response = await ai.models.list();
        console.log("Response structure:", Object.keys(response));
        console.log("Response JSON:", JSON.stringify(response).substring(0, 500));
    } catch (e) {
        console.error("Error listing models:", e.message);
    }
}

listModels();
