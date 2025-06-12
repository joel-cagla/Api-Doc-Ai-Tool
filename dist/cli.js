#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const main_1 = require("./main");
const program = new commander_1.Command();
program
    .name("api-doc-gen")
    .description("Generates API documentation from TypeScript functions using Llama3")
    .version("Alpha 1.0")
    .argument("<directory>", "Path to directory with TypeScript files")
    .option("-o, --output <file>", "Output file name", "DocsFile.txt")
    .action(async (directory, options) => {
    const fullPath = path.resolve(process.cwd(), directory);
    console.log(`Parsing directory: ${fullPath}`);
    const docs = await (0, main_1.extractFunctionsAndGenerateDocs)(fullPath);
    if (!docs) {
        console.log("No documentation generated.");
        return;
    }
    (0, main_1.writeDocumentsToFile)(docs, options.output);
    console.log(`Documentation written to ${options.output}`);
});
program.parse();
