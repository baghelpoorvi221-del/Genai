const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function testJson() {
    try {
        console.log("Testing JSON response with responseSchema...");
        const result = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: "Give me a JSON with a field 'hello' equal to 'world'",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        hello: { type: "STRING" }
                    },
                    required: ["hello"]
                }
            }
        });
        console.log("Success! Result keys:", Object.keys(result));
        console.log("Text:", result.text);
        console.log("Parsed:", JSON.stringify(result.parsed, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
        if (e.stack) console.error(e.stack);
    }
}

testJson();
