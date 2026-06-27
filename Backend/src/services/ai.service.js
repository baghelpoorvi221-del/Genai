const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g data structures, system design, mock interviews etc. "),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),

})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate. 
                        Return ONLY a JSON object that follows the schema provided. 
                        Do not include any introductory or concluding text.
                        
                        Candidate Details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const manualSchema = {
        type: "OBJECT",
        properties: {
            matchScore: { type: "NUMBER", description: "A score between 0 and 100" },
            technicalQuestions: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING" },
                        intention: { type: "STRING" },
                        answer: { type: "STRING" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING" },
                        intention: { type: "STRING" },
                        answer: { type: "STRING" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        skill: { type: "STRING" },
                        severity: { 
                            type: "STRING", 
                            enum: ["low", "medium", "high"],
                            description: "The severity of this skill gap"
                        }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        day: { type: "NUMBER" },
                        focus: { type: "STRING" },
                        tasks: {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: { type: "STRING" }
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
    };

    try {
        console.log("Calling AI Service with gemini-flash-latest...");
        const result = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: manualSchema,
            }
        });

        // In the @google/genai SDK, result.text is a getter that returns the first part's text
        let text = result.text;

        if (!text) {
            console.error("AI Result structure:", JSON.stringify(result, null, 2));
            throw new Error("AI Service returned an empty or unrecognizable response structure");
        }

        // Clean up markdown code blocks if they exist (though responseMimeType should prevent them)
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsedResponse = JSON.parse(text);
        console.log("Parsed AI Response successfully.");
        return parsedResponse;
    } catch (error) {
        console.error("AI Service Internal Error:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport }