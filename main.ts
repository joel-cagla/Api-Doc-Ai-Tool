import { Project } from "ts-morph";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

async function generateAPIDocFromFunction(fnCode: string) {
  const prompt = `You are a technical writer. Generate concise and clear REST-style API documentation in OpenAPI-flavored Markdown for the following TypeScript functions. Include endpoint path, method, description, parameters, request/response schemas if applicable.
\`\`\`ts
${fnCode}
\`\`\`
`;
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });

    //console.log("Raw: ", JSON.stringify(await response, null, 2));
    console.log(await response);
    const data: any = await response.json();
    return data.response;
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
