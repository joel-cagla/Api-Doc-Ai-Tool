import { Project } from "ts-morph";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { writeFileSync } from "fs";
import * as path from "path";

dotenv.config();

async function generateAPIDocFromFunction(fnCode: string) {
  const prompt = `You are a technical writer. Create concise and clear REST-style API documentation for the following TypeScript functions.
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

    //console.log("Raw response: ", JSON.stringify(await response, null, 2));
    //console.log(await response);
    const data: any = await response.json();
    return data.response;
  } catch (error) {
    console.log(error);
  }
}

async function extractFunctionsAndGenerateDocs(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const functions: { name: string; code: string }[] = [];

  if (sourceFile.getFunctions().length > 0) {
    const regularFunctions = sourceFile.getFunctions();
    for (const regularFn of regularFunctions) {
      functions.push({
        name: regularFn.getName()!,
        code: regularFn.getText(),
      });
    }
  }
  const declarations = sourceFile.getVariableDeclarations();

  for (const declaration of declarations) {
    const init = declaration.getInitializer();
    if (init && init.getKindName() === "ArrowFunction") {
      functions.push({
        name: declaration.getName(),
        code: declaration.getText(),
      });
    }
  }

  const docs: string[] = [];

  for (const fn of functions) {
    console.log(`Generating documentation for function: ${fn.name}`);
    const doc = await generateAPIDocFromFunction(fn.code);
    docs.push(`${fn.name}\n\n${doc}`);
  }
  return docs.join("\n\n---\n\n");
}

function writeDocumentsToFile(documents: string, filename: string) {
  const outputPath = path.resolve(__dirname, filename);
  writeFileSync(outputPath, documents, { encoding: "utf-8" });
  console.log("Documentation written to file");
}

(async () => {
  const filePath =
    "/Users/joeltron/Documents/GitHub/Api-Doc-Ai-Tool/files/nodeApnController.ts";
  const docs = await extractFunctionsAndGenerateDocs(filePath);
  console.log("\n API Documentation:\n");
  console.log(docs);
  writeDocumentsToFile(docs, "DocsFile.txt");
})();
