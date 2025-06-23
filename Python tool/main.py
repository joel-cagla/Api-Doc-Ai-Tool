import ast
import os
import sys
import requests

def extract_symbols_from_file(file_path): 
    with open(file_path, "r", encoding="utf-8") as file:
        source = file.read()
    tree = ast.parse(source, filename=file_path)

    symbols = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
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

def extract_symbols_from_directory(directory):
    all_symbols = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                symbols = extract_symbols_from_file(path)
                all_symbols.extend(symbols)
    return all_symbols

def generate_api_docs(symbol_code):
    prompt = f"Generate API documentation for the following Python code: {symbol_code}"
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )
    result = response.json()
    return result

def write_to_file(output, filename="Api-doc.md"):
    with open(filename, "w", encoding="utf-8") as file: 
        file.write(output)

def main(directory_path):
    symbols = extract_symbols_from_directory(directory_path)

    if not symbols:
        print('No symbols found')
        return
    
    documentation = generate_api_docs(symbols)
    if documentation:
        write_to_file(documentation)
        print("Documentation written")
    else:
        print("No documentation generated")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python api_doc_gen.py <path to source code directory>")
    else:
        main(sys.argv[1])
    
