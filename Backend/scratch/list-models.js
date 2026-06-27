const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function listModels() {
    try {
        console.log("Listing models...");
        const response = await ai.models.list();
        console.log("Response from ai.models.list():", JSON.stringify(response, null, 2));
        if (response && response.models) {
            response.models.forEach(m => {
                console.log(`- ${m.name}`);
            });
        } else {
            console.log("No models property in response.");
        }
    } catch (e) {
        console.error("Error listing models:", e.message);
    }
}

listModels();
