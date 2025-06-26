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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
const main_1 = require("./main");
const program = new commander_1.Command();
program
    .name("api-doc-gen")
    .description("Generates API documentation from TypeScript functions using Llama3")
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
    const selection = options.functions && !options.types
        ? "functions"
        : options.types && !options.functions
            ? "types"
            : options.routes && !options.functions && !options.types
                ? "routes"
                : "all";
    switch (selection) {
        case "functions": {
            console.log(chalk_1.default.black.bgCyan("Extracting functions only\n"));
            const functions = (0, main_1.extractAllFunctions)(fullPath);
            if (!functions) {
                console.log(chalk_1.default.white.bgRed("No functions extracted"));
                return;
            }
            const docs = await (0, main_1.generateDocsForSymbols)(functions);
            if (!docs) {
                console.log(chalk_1.default.white.bgRed("No documentation generated."));
                return;
            }
            (0, main_1.writeDocumentsToFile)([docs], options.output, options.outdir);
            break;
        }
        case "types": {
            console.log(chalk_1.default.black.bgCyan("Extracting types and interfaces only\n"));
            const types = (0, main_1.extractTypesAndInterfaces)(fullPath);
            if (!types) {
                console.log(chalk_1.default.white.bgRed("No types extracted"));
                return;
            }
            const docs = await (0, main_1.generateDocsForSymbols)(types);
            if (!docs) {
                console.log(chalk_1.default.white.bgRed("No documentation generated."));
                return;
            }
            (0, main_1.writeDocumentsToFile)([docs], options.output, options.outdir);
            break;
        }
        case "routes": {
            console.log(chalk_1.default.black.bgCyan("Extracting express routes only\n"));
            const routes = (0, main_1.extractExpressStyleRoutes)(fullPath);
            if (!routes) {
                console.log(chalk_1.default.white.bgRed("No routes extracted"));
                return;
            }
            const docs = await (0, main_1.generateDocsForRoutes)(routes);
            if (!docs) {
                console.log(chalk_1.default.white.bgRed("No documentation generated."));
                return;
            }
            (0, main_1.writeDocumentsToFile)([docs], options.output, options.outdir);
            break;
        }
        default: {
            console.log(chalk_1.default.black.bgCyan("Extracting All symbols\n"));
            const functions = (0, main_1.extractAllFunctions)(fullPath);
            const types = (0, main_1.extractTypesAndInterfaces)(fullPath);
            const routes = (0, main_1.extractExpressStyleRoutes)(fullPath);
            if (!functions && !types) {
                console.log(chalk_1.default.white.bgRed("No source code extracted"));
                return;
            }
            const symbolDocs = await (0, main_1.generateDocsForSymbols)([
                ...functions,
                ...types,
            ]);
            const routeDocs = await (0, main_1.generateDocsForRoutes)(routes);
            if (!symbolDocs && !routeDocs) {
                console.log(chalk_1.default.white.bgRed("No documentation generated."));
                return;
            }
            (0, main_1.writeDocumentsToFile)([symbolDocs, routeDocs], options.output, options.outdir);
            break;
        }
    }
});
program.parse();
