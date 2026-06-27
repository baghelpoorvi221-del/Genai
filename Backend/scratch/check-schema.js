const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const simpleSchema = z.object({
    name: z.string(),
    age: z.number()
});

console.log("Simple Schema:", JSON.stringify(zodToJsonSchema(simpleSchema), null, 2));
