#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as path from "path";
import {
  extractAllFunctions,
  generateDocsForSymbols,
  writeDocumentsToFile,
  extractTypesAndInterfaces,
  extractExpressStyleRoutes,
  generateDocsForRoutes,
} from "./main";

const program = new Command();
program
  .name("api-doc-gen")
  .description(
    "Generates API documentation from TypeScript functions using Llama3"
  )
  .version("Alpha 1.0")
  .argument("<directory>", "Path to directory with TypeScript files")
  .option("-f, --functions", "Only extract functions")
  .option("-t, --types", "Only extract types and interfaces")
  .option("-r, --routes", "Only extract express style routes")
  .option("-o, --output <file>", "Output file name", "DocsFile.txt")
  .option("--outdir <directory>", "Directory to write the output file to", ".")
  .action(async (directory, options) => {
    const fullPath = path.resolve(process.cwd(), directory);
    console.log(`Parsing directory: ${fullPath}`);

    const selection =
      options.functions && !options.types
        ? "functions"
        : options.types && !options.functions
        ? "types"
        : options.routes && !options.functions && !options.types
        ? "routes"
        : "all";

    switch (selection) {
      case "functions": {
        console.log(chalk.black.bgCyan("Extracting functions only\n"));
        const functions = extractAllFunctions(fullPath);
        if (!functions) {
          console.log(chalk.white.bgRed("No functions extracted"));
          return;
        }

        const docs = await generateDocsForSymbols(functions);

        if (!docs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile([docs], options.output, options.outdir);
        break;
      }
      case "types": {
        console.log(
          chalk.black.bgCyan("Extracting types and interfaces only\n")
        );
        const types = extractTypesAndInterfaces(fullPath);

        if (!types) {
          console.log(chalk.white.bgRed("No types extracted"));
          return;
        }

        const docs = await generateDocsForSymbols(types);

        if (!docs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile([docs], options.output, options.outdir);
        break;
      }
      case "routes": {
        console.log(chalk.black.bgCyan("Extracting express routes only\n"));
        const routes = extractExpressStyleRoutes(fullPath);

        if (!routes) {
          console.log(chalk.white.bgRed("No routes extracted"));
          return;
        }

        const docs = await generateDocsForRoutes(routes);

        if (!docs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile([docs], options.output, options.outdir);
        break;
      }
      default: {
        console.log(chalk.black.bgCyan("Extracting All symbols\n"));
        const functions = extractAllFunctions(fullPath);
        const types = extractTypesAndInterfaces(fullPath);
        const routes = extractExpressStyleRoutes(fullPath);

        if (!functions && !types) {
          console.log(chalk.white.bgRed("No source code extracted"));
          return;
        }

        const symbolDocs = await generateDocsForSymbols([
          ...functions,
          ...types,
        ]);
        const routeDocs = await generateDocsForRoutes(routes);
        if (!symbolDocs && !routeDocs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile(
          [symbolDocs, routeDocs],
          options.output,
          options.outdir
        );
        break;
      }
    }
  });

program.parse();
