import { Project } from "ts-morph";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const LLM_API_URL = process.env.LLM_API_URL;
const API_KEY = process.env.API_KEY;

async function generateAPIDocFromFunction(fnCode: string): Promise<string> {
  const prompt = `Generate REST-style API documentation in OpenAPI-flavored Markdown for the following TypeScript functions. Include endpoint path, method, description, parameters, request/response schemas if applicable.
\`\`\`ts
${fnCode}
\`\`\`
`;

  const response = await axios.post(
    LLM_API_URL!,
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.generated_text || "No output";
}

async function extractFunctionsAndGenerateDocs(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  const functions = sourceFile.getFunctions();
  const docs: string[] = [];

  for (const fn of functions) {
    const fnCode = fn.getText();
    console.log(`Generating documentation for function: ${fn.getName()}`);
    const doc = await generateAPIDocFromFunction(fnCode);
    docs.push(`${fn.getName()}\n\n${doc}`);
  }

  return docs.join("\n\n---\n\n");
}

(async () => {
  const filePath = "./nodeApnController.ts";
  const docs = await extractFunctionsAndGenerateDocs(filePath);
  console.log("\n API Documentation:\n");
  console.log(docs);
})();
