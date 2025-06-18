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
  .option("-o, --output <file>", "Output file name", "DocsFile.txt")
  .action(async (directory, options) => {
    const fullPath = path.resolve(process.cwd(), directory);
    console.log(`Parsing directory: ${fullPath}`);

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
      chalk.white.bgGreen.bold(`Documentation written to ${options.output}`)
    );
  });

program.parse();
