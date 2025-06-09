import { Project } from "ts-morph";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { InferenceClient } from "@huggingface/inference";
import { apis } from "@huggingface/transformers/types/env";

dotenv.config();

const LLM_API_URL = process.env.LLM_API_URL;
const API_KEY = process.env.API_KEY;

const client = new InferenceClient(API_KEY);

async function generateAPIDocFromFunction(fnCode: string): Promise<any> {
  const prompt = `Generate REST-style API documentation in OpenAPI-flavored Markdown for the following TypeScript functions. Include endpoint path, method, description, parameters, request/response schemas if applicable.
\`\`\`ts
${fnCode}
\`\`\`
`;
  try {
    const response = await client.chatCompletion({
      provider: "novita",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    // const response = await fetch(
    //   "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify(prompt),
    //   }
    // );

    console.log(response);

    const raw: any = await response;
    console.log("Raw response: ", JSON.stringify(raw, null, 2));

    if ("error" in raw) {
      return `Error from model: ${raw.error}`;
    }

    console.log(response.choices[0].message);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function extractFunctionsAndGenerateDocs(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const declarations = sourceFile.getVariableDeclarations();
  const functions: { name: string; code: string }[] = [];
  const docs: string[] = [];

  for (const declaration of declarations) {
    const init = declaration.getInitializer();
    if (init && init.getKindName() === "ArrowFunction") {
      functions.push({
        name: declaration.getName(),
        code: declaration.getText(),
      });
    }
  }

  for (const fn of functions) {
    console.log(`Generating documentation for function: ${fn.name}`);
    const doc = await generateAPIDocFromFunction(fn.code);
    docs.push(`${fn.name}\n\n${doc}`);
  }
  return docs.join("\n\n---\n\n");
}

(async () => {
  const filePath =
    "/Users/joeltron/Documents/GitHub/Api-Doc-Ai-Tool/files/nodeApnController.ts";
  const docs = await extractFunctionsAndGenerateDocs(filePath);
  console.log("\n API Documentation:\n");
  console.log(docs);
})();
