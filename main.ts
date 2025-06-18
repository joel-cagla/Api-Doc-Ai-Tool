import { Project } from "ts-morph";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

async function generateAPIDocFromFunction(fnCode: string[]) {
  const prompt = `You are a technical writer. Create concise and clear REST-style API documentation for the following TypeScript functions. Do not include any pleasantries or anything other than the documentation itself.
\`\`\`
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

    const data: any = await response.json();
    return data.response;
  } catch (error) {
    console.log(error);
  }
}

export async function generateDocs(
  extractedFunctions: {
    name: string;
    code: string;
  }[]
) {
  const docs: string[] = [];

  const functionNumberLimit = 4;

  for (let i = 0; i < extractedFunctions.length; i += functionNumberLimit) {
    const chunk = extractedFunctions.slice(i, i + functionNumberLimit);
    const funcCodes = chunk.map((func) => func.code);
    const funcNames = chunk.map((func) => func.name).join(", ");

    console.log(`Generating documentation for functions: ${funcNames}`);
    const doc = await generateAPIDocFromFunction(funcCodes);
    docs.push(`\n\n${doc}`);
  }
  return docs.join("\n\n---\n\n");
}

export function extractAllFunctions(directoryPath: string) {
  const project = new Project();
  project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);

  const functions: { name: string; code: string }[] = [];

  const sourceFiles = project.getSourceFiles();

  if (!sourceFiles.length) {
    console.log("No source code files found");
    return;
  }

  for (const file of sourceFiles) {
    if (file.getFunctions().length > 0) {
      const regularFunctions = file.getFunctions();
      for (const regularFn of regularFunctions) {
        functions.push({
          name: regularFn.getName() ?? "anonymous",
          code: regularFn.getText(),
        });
      }
    }
    const declarations = file.getVariableDeclarations();

    for (const declaration of declarations) {
      const init = declaration.getInitializer();
      if (init && init.getKindName() === "ArrowFunction") {
        functions.push({
          name: declaration.getName(),
          code: declaration.getText(),
        });
      }
    }
  }
  return functions;
}

export function writeDocumentsToFile(documents: string, filename: string) {
  const outputPath = path.resolve(__dirname, filename);
  fs.writeFileSync(outputPath, documents, { encoding: "utf-8" });
}
