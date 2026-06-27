const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function listModels() {
    try {
        const response = await ai.models.list();
        console.log("Keys:", Object.keys(response));
        // If it's an array directly
        if (Array.isArray(response)) {
            console.log("Response is an array");
            response.forEach(m => console.log(m.name));
        } else {
            // Check for models property
            for (const key in response) {
                if (Array.isArray(response[key])) {
                    console.log(`Found array in key: ${key}`);
                    response[key].forEach(m => console.log(m.name));
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
