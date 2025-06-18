import { Project } from "ts-morph";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";

dotenv.config();

async function generateAPIDocFromFunction(symbolCode: string[]) {
  const prompt = `You are a technical writer. You will be given the source code for a number of TypeScript functions, types and interfaces. 
  Create concise and clear REST-style API documentation for all of the functions, types and interfaces you recieve. 
  Separate the functions, types and interfaces and group them into separate sections.
  Do not include any pleasantries or anything other than the documentation itself.
\`\`\`
${symbolCode}
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
    console.log(chalk.white.bgRed.bold("An error occurred: "), error);
  }
}

export async function generateDocs(
  extractedSymbols: {
    name: string;
    code: string;
  }[]
) {
  const docs: string[] = [];

  const symbolNumberLimit = 4;

  for (let i = 0; i < extractedSymbols.length; i += symbolNumberLimit) {
    const chunk = extractedSymbols.slice(i, i + symbolNumberLimit);
    const symbolCode = chunk.map((symbol) => symbol.code);
    const symbolNames = chunk.map((symbol) => symbol.name).join(", ");

    console.log(
      chalk.black.bgCyan.bold(
        `Generating documentation for the following symbols: ${symbolNames}\n`
      )
    );
    const doc = await generateAPIDocFromFunction(symbolCode);
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
    console.log(chalk.red.bgWhite("No source code files found"));
    return functions;
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

export function extractTypesAndInterfaces(directoryPath: string) {
  const project = new Project();
  project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);

  const types: { name: string; code: string }[] = [];

  const sourceFiles = project.getSourceFiles();

  if (!sourceFiles.length) {
    console.log(chalk.red.bgWhite("No source code files found"));
    return types;
  }

  for (const file of sourceFiles) {
    const typeAliases = file.getTypeAliases();
    for (const alias of typeAliases) {
      types.push({
        name: alias.getName(),
        code: alias.getText(),
      });
    }

    const interfaces = file.getInterfaces();
    for (const iface of interfaces) {
      types.push({
        name: iface.getName(),
        code: iface.getText(),
      });
    }
  }
  return types;
}

export function writeDocumentsToFile(documents: string, filename: string) {
  const outputPath = path.resolve(__dirname, filename);
  fs.writeFileSync(outputPath, documents, { encoding: "utf-8" });
}
