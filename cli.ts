#!/usr/bin/env node

import { Command } from "commander";
import * as path from "path";
import { extractFunctionsAndGenerateDocs, writeDocumentsToFile } from "./main";

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

    const docs = await extractFunctionsAndGenerateDocs(fullPath);
    if (!docs) {
      console.log("No documentation generated.");
      return;
    }
    writeDocumentsToFile(docs, options.output);
    console.log(`Documentation written to ${options.output}`);
  });

program.parse();
