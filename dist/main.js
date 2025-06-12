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
exports.extractFunctionsAndGenerateDocs = extractFunctionsAndGenerateDocs;
exports.writeDocumentsToFile = writeDocumentsToFile;
const ts_morph_1 = require("ts-morph");
const dotenv = __importStar(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
dotenv.config();
async function generateAPIDocFromFunction(fnCode) {
    const prompt = `You are a technical writer. Create concise and clear REST-style API documentation for the following TypeScript functions. Do not include any pleasantries or any other writing than the documentation itself.
\`\`\`
${fnCode}
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
        //console.log("Raw response: ", JSON.stringify(await response, null, 2));
        //console.log(await response);
        const data = await response.json();
        return data.response;
    }
    catch (error) {
        console.log(error);
    }
}
async function extractFunctionsAndGenerateDocs(directoryPath) {
    const project = new ts_morph_1.Project();
    project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,tsx}`);
    const docs = [];
    const sourceFiles = project.getSourceFiles();
    if (!sourceFiles.length) {
        console.log("No source code files found");
        return;
    }
    for (const file of sourceFiles) {
        const functions = [];
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
        for (const fn of functions) {
            console.log(`Generating documentation for function: ${fn.name}`);
            const doc = await generateAPIDocFromFunction(fn.code);
            docs.push(`${fn.name}\n\n${doc}`);
        }
    }
    return docs.join("\n\n---\n\n");
}
function writeDocumentsToFile(documents, filename) {
    const outputPath = path.resolve(__dirname, filename);
    fs.writeFileSync(outputPath, documents, { encoding: "utf-8" });
}
// (async () => {
//   const directoryPath = path.resolve(__dirname, "./files");
//   const docs = await extractFunctionsAndGenerateDocs(directoryPath);
//   console.log("\n API Documentation:\n");
//   console.log(docs);
//   writeDocumentsToFile(docs!, "DocsFile.txt");
// })();
