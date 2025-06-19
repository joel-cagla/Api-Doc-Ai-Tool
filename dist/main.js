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
exports.generateDocsForSymbols = generateDocsForSymbols;
exports.generateDocsForRoutes = generateDocsForRoutes;
exports.extractAllFunctions = extractAllFunctions;
exports.extractTypesAndInterfaces = extractTypesAndInterfaces;
exports.extractExpressStyleRoutes = extractExpressStyleRoutes;
exports.writeDocumentsToFile = writeDocumentsToFile;
const ts_morph_1 = require("ts-morph");
const dotenv = __importStar(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
dotenv.config();
async function generateAPIDocFromFunction(symbolCode) {
    const prompt = `
  You are a technical writer. 
  You will be given the source code for a number of TypeScript functions, types, interfaces and Express style routes, either separately or all together.
  Create concise and clear REST-style API documentation for all of the functions, types, interfaces and routes you receive. 
  If you only recieve one type of source code, only produce documnetation for that type. 
  Separate the functions, types and interfaces and group them into separate sections.
  Do not include any pleasantries or anything other than the documentation itself.
\`\`\`
${symbolCode}
\`\`\`
`;
    try {
        const response = await (0, node_fetch_1.default)("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3",
                prompt,
                stream: false,
            }),
        });
        const data = await response.json();
        return data.response;
    }
    catch (error) {
        console.log(chalk_1.default.white.bgRed.bold("An error occurred: "), error);
    }
}
async function generateDocsForSymbols(extractedSymbols) {
    const docs = [];
    const symbolNumberLimit = 4;
    for (let i = 0; i < extractedSymbols.length; i += symbolNumberLimit) {
        const chunk = extractedSymbols.slice(i, i + symbolNumberLimit);
        const symbolCode = chunk.map((symbol) => symbol.code);
        const symbolNames = chunk.map((symbol) => symbol.name).join(", ");
        console.log(chalk_1.default.black.bgCyan.bold(`Generating documentation for the following symbols: ${symbolNames}\n`));
        const doc = await generateAPIDocFromFunction(symbolCode);
        docs.push(`\n\n${doc}`);
    }
    return docs.join("\n\n---\n\n");
}
async function generateDocsForRoutes(routes) {
    const docs = [];
    const symbolNumberLimit = 4;
    for (let i = 0; i < routes.length; i += symbolNumberLimit) {
        const chunk = routes.slice(i, i + symbolNumberLimit);
        const fullRoute = chunk.map((route) => `${route.method.toUpperCase()} ${route.path} -> ${route.handler}`);
        console.log(chalk_1.default.black.bgCyan.bold(`Generating documentation for the following route paths: ${chunk
            .map((route) => route.path)
            .join(", ")}\n`));
        const doc = await generateAPIDocFromFunction(fullRoute);
        docs.push(`\n\n${doc}`);
    }
    return docs.join("\n\n---\n\n");
}
function extractAllFunctions(directoryPath) {
    const project = new ts_morph_1.Project();
    project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);
    const functions = [];
    const sourceFiles = project.getSourceFiles();
    if (!sourceFiles.length) {
        console.log(chalk_1.default.red.bgWhite("No source code files found"));
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
function extractTypesAndInterfaces(directoryPath) {
    const project = new ts_morph_1.Project();
    project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);
    const types = [];
    const sourceFiles = project.getSourceFiles();
    if (!sourceFiles.length) {
        console.log(chalk_1.default.red.bgWhite("No source code files found"));
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
function extractExpressStyleRoutes(directoryPath) {
    const project = new ts_morph_1.Project();
    project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);
    const routes = [];
    const sourceFiles = project.getSourceFiles();
    for (const file of sourceFiles) {
        const callExpressions = file.getDescendantsOfKind(ts_morph_1.SyntaxKind.CallExpression);
        for (const callExpression of callExpressions) {
            const expression = callExpression.getExpression();
            if (expression.getKind() === ts_morph_1.SyntaxKind.PropertyAccessExpression) {
                const propertyAccess = expression.asKindOrThrow(ts_morph_1.SyntaxKind.PropertyAccessExpression);
                const method = propertyAccess.getName();
                const caller = propertyAccess.getExpression().getText();
                if (caller !== "router")
                    continue;
                const callArguments = callExpression.getArguments();
                if (callArguments.length >= 2) {
                    const pathArgument = callArguments[0];
                    const handlerArgument = callArguments[1];
                    if (pathArgument.getKind() === ts_morph_1.SyntaxKind.StringLiteral &&
                        (handlerArgument.getKind() ===
                            ts_morph_1.SyntaxKind.PropertyAccessExpression ||
                            handlerArgument.getKind() === ts_morph_1.SyntaxKind.Identifier)) {
                        const routePath = pathArgument.getText();
                        const handlerName = handlerArgument.getText();
                        routes.push({
                            method,
                            path: routePath,
                            handler: handlerName,
                        });
                    }
                }
            }
        }
    }
    return routes;
}
function writeDocumentsToFile(documents, filename) {
    const outputPath = path.resolve(__dirname, filename);
    const fullText = documents.join("\n\n---\n\n");
    fs.writeFileSync(outputPath, fullText, { encoding: "utf-8" });
}
