const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function listModels() {
    try {
        const response = await ai.models.list();
        response.models.forEach(m => {
            if (m.name.includes("flash")) {
                console.log(m.name);
            }
        });
    } catch (e) {
        console.error(e.message);
    }
}

listModels();
