const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function listModels() {
    try {
        const response = await ai.models.list();
        console.log("Response keys:", Object.keys(response));
        // If it's a pageable response, it might be different
        if (Array.isArray(response)) {
            console.log("Response is an array of length:", response.length);
        } else {
            // Check for models property
            for (const key in response) {
                console.log(`Key: ${key}, Type: ${typeof response[key]}`);
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

listModels();
