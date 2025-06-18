#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as path from "path";
import {
  extractAllFunctions,
  generateDocs,
  writeDocumentsToFile,
  extractTypesAndInterfaces,
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
  .option("-o, --output <file>", "Output file name", "DocsFile.txt")
  .action(async (directory, options) => {
    const fullPath = path.resolve(process.cwd(), directory);
    console.log(`Parsing directory: ${fullPath}`);

    const selection =
      options.functions && !options.types
        ? "functions"
        : options.types && !options.functions
        ? "types"
        : "all";

    switch (selection) {
      case "functions": {
        console.log(chalk.black.bgCyan("Extracting functions only\n"));
        const functions = extractAllFunctions(fullPath);
        if (!functions) {
          console.log(chalk.white.bgRed("No functions extracted"));
          return;
        }

        const docs = await generateDocs(functions);

        if (!docs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile(docs, options.output);
        console.log(
          chalk.green.bgBlack.bold(`Documentation written to ${options.output}`)
        );
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

        const docs = await generateDocs(types);

        if (!docs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile(docs, options.output);
        console.log(
          chalk.green.bgBlack.bold(`Documentation written to ${options.output}`)
        );
        break;
      }
      default: {
        console.log(chalk.black.bgCyan("Extracting All symbols\n"));
        const functions = extractAllFunctions(fullPath);
        const types = extractTypesAndInterfaces(fullPath);

        if (!functions && !types) {
          console.log(chalk.white.bgRed("No source code extracted"));
          return;
        }

        const docs = await generateDocs([...functions, ...types]);
        if (!docs) {
          console.log(chalk.white.bgRed("No documentation generated."));
          return;
        }
        writeDocumentsToFile(docs, options.output);
        console.log(
          chalk.green.bgBlack.bold(`Documentation written to ${options.output}`)
        );
        break;
      }
    }
  });

program.parse();
