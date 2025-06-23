import { Project, SyntaxKind } from "ts-morph";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";

dotenv.config();

async function generateAPIDocFromFunction(symbolCode: string[]) {
  const prompt = `
  You are a technical writer. 
  You will be given the source code for TypeScript functions, types, interfaces and Express style routes. 
  You may be given the source code for these symbols either separately or all together.
  Create concise and clear REST-style API documentation for all of the functions, types, interfaces and routes you receive. 
  If you only recieve one type of symbol, only produce documnetation for that symbol. 
  For example, if you only receive source code for functions, only create documentation for those functions.
  Each source code block is labeled with the file it comes from. Group the documentation under each file name.
  Source code blocks with the same file name must be grouped together.
  Separate the functions, types, interfaces and Express style routes and group them into separate sections.
  Do not include any pleasantries or any writing other than the documentation itself.
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

export async function generateDocsForSymbols(
  extractedSymbols: {
    name: string;
    code: string;
    file: string;
  }[]
) {
  const docs: string[] = [];

  const symbolNumberLimit = 4;

  for (let i = 0; i < extractedSymbols.length; i += symbolNumberLimit) {
    const chunk = extractedSymbols.slice(i, i + symbolNumberLimit);
    const symbolCode = chunk.map(
      (symbol) => `//File: ${symbol.file}\n${symbol.code}`
    );
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

export async function generateDocsForRoutes(
  routes: {
    method: string;
    path: string;
    handler: string;
  }[]
) {
  const docs: string[] = [];

  const symbolNumberLimit = 4;

  for (let i = 0; i < routes.length; i += symbolNumberLimit) {
    const chunk = routes.slice(i, i + symbolNumberLimit);

    const fullRoute = chunk.map(
      (route) =>
        `${route.method.toUpperCase()} ${route.path} -> ${route.handler}`
    );

    console.log(
      chalk.black.bgCyan.bold(
        `Generating documentation for the following route paths: ${chunk
          .map((route) => route.path)
          .join(", ")}\n`
      )
    );
    const doc = await generateAPIDocFromFunction(fullRoute);
    docs.push(`\n\n${doc}`);
  }
  return docs.join("\n\n---\n\n");
}

export function extractAllFunctions(directoryPath: string) {
  const project = new Project();
  project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);

  const functions: { name: string; code: string; file: string }[] = [];

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
          file: file.getBaseName(),
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
          file: file.getBaseName(),
        });
      }
    }
  }
  return functions;
}

export function extractTypesAndInterfaces(directoryPath: string) {
  const project = new Project();
  project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);

  const types: { name: string; code: string; file: string }[] = [];

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
        file: file.getBaseName(),
      });
    }

    const interfaces = file.getInterfaces();
    for (const iface of interfaces) {
      types.push({
        name: iface.getName(),
        code: iface.getText(),
        file: file.getBaseName(),
      });
    }
  }
  return types;
}

export function extractExpressStyleRoutes(directoryPath: string) {
  const project = new Project();
  project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);

  const routes: {
    method: string;
    path: string;
    handler: string;
    file: string;
  }[] = [];

  const sourceFiles = project.getSourceFiles();

  for (const file of sourceFiles) {
    const callExpressions = file.getDescendantsOfKind(
      SyntaxKind.CallExpression
    );
    for (const callExpression of callExpressions) {
      const expression = callExpression.getExpression();

      if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
        const propertyAccess = expression.asKindOrThrow(
          SyntaxKind.PropertyAccessExpression
        );
        const method = propertyAccess.getName();
        const caller = propertyAccess.getExpression().getText();

        if (caller !== "router") continue;

        const callArguments = callExpression.getArguments();

        if (callArguments.length >= 2) {
          const pathArgument = callArguments[0];
          const handlerArgument = callArguments[1];

          if (
            pathArgument.getKind() === SyntaxKind.StringLiteral &&
            (handlerArgument.getKind() ===
              SyntaxKind.PropertyAccessExpression ||
              handlerArgument.getKind() === SyntaxKind.Identifier)
          ) {
            const routePath = pathArgument.getText();
            const handlerName = handlerArgument.getText();

            routes.push({
              method,
              path: routePath,
              handler: handlerName,
              file: file.getBaseName(),
            });
          }
        }
      }
    }
  }
  return routes;
}

export function writeDocumentsToFile(documents: string[], filename: string) {
  const outputPath = path.resolve(__dirname, filename);
  const fullText = documents.join("\n\n---\n\n");
  fs.writeFileSync(outputPath, fullText, { encoding: "utf-8" });
}
