#!/usr/bin/env python3

import ast
import os
import requests
import argparse

def extract_all_symbols_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        source = file.read()
    tree = ast.parse(source, filename=file_path)

    symbols = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef,)):
            start_line = node.lineno - 1
            end_line = node.body[-1].lineno
            code_lines = source.splitlines()[start_line:end_line]
            code = "\n".join(code_lines)

            symbols.append({
                "name": node.name,
                "code": code,
                "file": os.path.basename(file_path)
            })

    return symbols

def extract_functions_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        source = file.read()
    tree = ast.parse(source, filename=file_path)

    functions = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef)):
            start_line = node.lineno - 1
            end_line = node.body[-1].lineno
            code_lines = source.splitlines()[start_line:end_line]
            code = "\n".join(code_lines)

            functions.append({
                "name": node.name,
                "code": code,
                "file": os.path.basename(file_path)
            })

    return functions


def extract_async_functions_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        source = file.read()
    tree = ast.parse(source, filename=file_path)

    async_functions = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.AsyncFunctionDef)):
            start_line = node.lineno - 1
            end_line = node.body[-1].lineno
            code_lines = source.splitlines()[start_line:end_line]
            code = "\n".join(code_lines)

            async_functions.append({
                "name": node.name,
                "code": code,
                "file": os.path.basename(file_path)
            })

    return async_functions


def extract_classes_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        source = file.read()
    tree = ast.parse(source, filename=file_path)

    classes = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.ClassDef,)):
            start_line = node.lineno - 1
            end_line = node.body[-1].lineno
            code_lines = source.splitlines()[start_line:end_line]
            code = "\n".join(code_lines)

            classes.append({
                "name": node.name,
                "code": code,
                "file": os.path.basename(file_path)
            })

    return classes


def extract_symbols_from_directory(directory, argument_option):
    print("Extracting from directory: ", directory)

    all_symbols = []
    match argument_option:
        case "-f":
            print("Extracting functions only")
        case "-af":
            print("Extracting async functions only")
        case "-c":
            print("Extracting classes only")
        case "":
            print("Extracting all symbols")
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                match argument_option:
                    case "-f" | "--functions":
                        symbols = extract_functions_from_file(path)
                        all_symbols.extend(symbols)
                    case "-af" | "--asyncfunctions":
                        symbols = extract_async_functions_from_file(path)
                        all_symbols.extend(symbols)
                    case "-c" | "--classes":
                        symbols = extract_classes_from_file(path)
                        all_symbols.extend(symbols)
                    case "":
                        symbols = extract_all_symbols_from_file(path)
                        all_symbols.extend(symbols)
    return all_symbols

def generate_api_docs(symbols, limit=4):
    docs = []
    for chunk in chunk_list(symbols, limit):
        symbol_code = ""
        for symbol in chunk:
            symbol_code += f"# File: {symbol['file']}\n{symbol['code']}\n\n"
        prompt = (
            "You are a technical writer."
            "You will be given Python source code."
            "You may be given the source code for a number symbols either separately or all together."
            "Create concise and clear REST-style API documentation for all of the source code you receive."
            "If you only recieve one type of symbol, only produce documnetation for that symbol."
            "For example, if you only receive source code for functions, only create documentation for those functions."
            "Each source code block is labeled with the file it comes from."
            "Group the documentation under each file name."
            "Source code blocks with the same file name must be grouped together."
            "Separate the different types of symbols and group them into separate sections."
            "Keep the format exactly the same for all documentation."
            "Do not include any pleasantries or any writing other than the documentation itself.\n\n"
            f"Source code: {symbol_code}"
        )
    
        response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
        )
        
        result = response.json()
        docs.append(result.get("response", ""))
    return "\n\n---\n\n".join(docs)

def write_to_file(output, filename="Api-doc.md", outdir="."):
    os.makedirs(outdir, exist_ok=True)
    full_path = os.path.join(outdir, filename)
    with open(full_path, "w", encoding="utf-8") as file:
        file.write(output)
    print(f"Documentation written to {full_path}")

def chunk_list(symbol_list, limit):
    for i in range(0, len(symbol_list), limit):
        yield symbol_list[i:i + limit]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", help="Directory containing Python source code files")
    parser.add_argument("-o", "--output", help="Output file name", default="API-doc.md")
    parser.add_argument("-f", "--functions", help="Only extract functions", action="store_true")
    parser.add_argument("-af", "--asyncfunctions", help="Only extract async functions", action="store_true")
    parser.add_argument("-c", "--classes", help="Only extract classes", action="store_true")
    parser.add_argument("-odir", "--outdir", help="Directory to write the output file to", default=".")

    arguments = parser.parse_args()

    if arguments.functions:
        option = "-f"
    elif arguments.asyncfunctions:
        option = "-af"
    elif arguments.classes:
        option = "-c"
    else:
        option = ""

    symbols = extract_symbols_from_directory(arguments.directory, option)
    if not symbols:
        print("No symbols extracted")
        return

    documentation = generate_api_docs(symbols)
    if documentation:
        write_to_file(documentation, arguments.output, arguments.outdir)
    else:
        print("No documentation generated")

if __name__ == "__main__":
    main()
    
